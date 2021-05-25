import { withPluginApi } from "discourse/lib/plugin-api";
import showModal from "discourse/lib/show-modal";
import { detectUnformattedCode } from "../core/detect-code";

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
      api.modifyClass("model:composer", {
        ucd_shouldPermanentlyDismiss: false,

        ucd_checkPermanentlyDismissed: () =>
          !!localStorage.ucd_warningPermanentlyDismissed,

        ucd_checkShouldIgnoreWarning() {
          if (localStorage.ucd_forceShowWarning) return false;

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
