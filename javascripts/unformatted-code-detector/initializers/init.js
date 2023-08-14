import { withPluginApi } from "discourse/lib/plugin-api";
import showModal from "discourse/lib/show-modal";
import { detectUnformattedCode, printDebugInfo } from "../core/detect-code";
import { randomizeEmojiDiversity } from "../lib/emoji-diversity";
import { emojiUnescape } from "discourse/lib/text";
import { htmlSafe } from "@ember/template";
import { registerUnbound } from "discourse-common/lib/helpers";
import I18n from "I18n";
import { escape } from "pretty-text/sanitizer";
import ModalUcdWarning from "../../components/modal/ucd-warning";
import { inject as service } from "@ember/service";

const getDisableAtTrustLevel = () =>
  settings.disable_at_trust_level === -1
    ? Infinity
    : settings.disable_at_trust_level;

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

      registerUnbound("modal-ucd-title", () => {
        return htmlSafe(
          [
            emojiUnescape(escape(randomizeEmojiDiversity(settings.emoji_icon))),
            escape(I18n.t(themePrefix("warning_modal.title"))),
          ].join(" ")
        );
      });

      api.modifyClass("model:composer", {
        ucdState: service("ucd-state"),
        pluginId: "unformatted-code-detector",
        ucd_previousWarningIgnored: false,

        ucd_checkShouldIgnoreWarning() {
          return (
            this.ucd_previousWarningIgnored ||
            this.ucdState.permanentlyDismissed ||
            api.getCurrentUser()?.trust_level >= getDisableAtTrustLevel()
          );
        },

        ucd_checkUnformattedCodeDetected() {
          return detectUnformattedCode(this.reply);
        },
      });

      api.modifyClass("controller:composer", {
        pluginId: "unformatted-code-detector",

        save(...args) {
          if (
            this.model.ucd_checkUnformattedCodeDetected() &&
            !this.model.ucd_checkShouldIgnoreWarning()
          ) {
            this.modal.show(ModalUcdWarning, {
              model: this.model,
            });
          } else {
            this._super(...args);
          }
        },
      });
    });
  },
};
