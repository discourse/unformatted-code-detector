import { service } from "@ember/service";
import { withPluginApi } from "discourse/lib/plugin-api";
import ModalUcdWarning from "../components/modal/ucd-warning";
import { detectUnformattedCode, printDebugInfo } from "../core/detect-code";

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

      api.modifyClass(
        "model:composer",
        (Superclass) =>
          class extends Superclass {
            @service ucdState;

            ucd_previousWarningIgnored = false;

            ucd_checkShouldIgnoreWarning() {
              return (
                this.ucd_previousWarningIgnored ||
                this.ucdState.permanentlyDismissed ||
                api.getCurrentUser()?.trust_level >= getDisableAtTrustLevel()
              );
            }

            ucd_checkUnformattedCodeDetected() {
              return detectUnformattedCode(this.reply);
            }
          }
      );

      api.modifyClass(
        "service:composer",
        (Superclass) =>
          class extends Superclass {
            save(...args) {
              if (
                this.model.ucd_checkUnformattedCodeDetected() &&
                !this.model.ucd_checkShouldIgnoreWarning()
              ) {
                this.modal.show(ModalUcdWarning, {
                  model: this.model,
                });
              } else {
                super.save(...args);
              }
            }
          }
      );
    });
  },
};
