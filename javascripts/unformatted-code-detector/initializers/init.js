import { withPluginApi } from "discourse/lib/plugin-api";
import showModal from "discourse/lib/show-modal";
import { detectUnformattedCode, printDebugInfo } from "../core/detect-code";
import { randomizeEmojiDiversity } from "../helpers/emoji-diversity";
import { emojiUnescape } from "discourse/lib/text";
import { htmlSafe } from "@ember/template";
import { registerUnbound } from "discourse-common/lib/helpers";
import I18n from "I18n";
import { escape } from "pretty-text/sanitizer";

const getDisableAtTrustLevel = () =>
  settings.disable_at_trust_level === -1
    ? Infinity
    : settings.disable_at_trust_level;

// for testing/debugging:
// localStorage.ucd_forceShowWarning = '1'

export default {
  name: "unformatted-code-detector",
  initialize() {
    withPluginApi("0.8.8", (api) => {
      window.debugUnformattedCodeDetector = () => {
        const content = document.querySelector(
          "#reply-control textarea.d-editor-input"
        )?.value;
        if (!content) {
          // eslint-disable-next-line no-console
          console.log("No content found");
        } else {
          printDebugInfo(content);
        }
      };

      registerUnbound("ucd-modal-title", () => {
        return htmlSafe(
          [
            emojiUnescape(escape(randomizeEmojiDiversity(settings.emoji_icon))),
            escape(I18n.t(themePrefix("warning_modal.title"))),
          ].join(" ")
        );
      });

      api.modifyClass("model:composer", {
        pluginId: "unformatted-code-detector",
        ucd_shouldPermanentlyDismiss: false,

        ucd_checkPermanentlyDismissed: () =>
          !!localStorage.ucd_warningPermanentlyDismissed,

        ucd_checkShouldIgnoreWarning() {
          if (localStorage.ucd_forceShowWarning) {
            return false;
          }

          return (
            this.ucd_previousWarningIgnored ||
            this.ucd_checkPermanentlyDismissed() ||
            api.getCurrentUser().trust_level >= getDisableAtTrustLevel()
          );
        },

        ucd_checkUnformattedCodeDetected() {
          return detectUnformattedCode(this.reply);
        },
      });

      api.modifyClass("controller:composer", {
        pluginId: "unformatted-code-detector",
        ucd_permanentlyDismiss() {
          localStorage.ucd_warningPermanentlyDismissed = "1";
        },

        ucd_closeModal() {
          if (this.model.ucd_shouldPermanentlyDismiss) {
            this.ucd_permanentlyDismiss();
          }

          this.send("closeModal");
        },

        save(...args) {
          const model = this.model;
          const _this = this;
          const _super = this._super;

          if (
            model.ucd_checkUnformattedCodeDetected() &&
            !model.ucd_checkShouldIgnoreWarning()
          ) {
            const warningModal = showModal("ucdWarningModal", {
              modalClass: "ucd_warning-modal",
              model,
            });

            warningModal.actions.ignoreAndProceed = () => {
              _this.ucd_closeModal.call(_this);
              _super.call(_this, ...args);
            };

            warningModal.actions.goBackAndFix = () =>
              _this.ucd_closeModal.call(_this);
          } else {
            this._super(...args);
          }
        },
      });
    });
  },
};
