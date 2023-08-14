import { action } from "@ember/object";
import Component from "@glimmer/component";
import { inject as service } from "@ember/service";
import { inject as controller } from "@ember/controller";

export default class UcdWarning extends Component {
  @service modal;
  @service ucdState;

  @controller composer;

  get shouldPermanentlyDismiss() {
    return this.ucdState.permanentlyDismissed ?? false;
  }

  @action
  toggleShouldPermanentlyDismiss() {
    this.ucdState.toggle();
  }

  @action
  goBackAndFix() {
    this.modal.close();
  }

  @action
  ignoreAndProceed() {
    this.modal.close();
    this.composer.model.ucd_previousWarningIgnored = true;
    this.composer.save();
  }
}
