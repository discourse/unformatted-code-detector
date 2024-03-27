import Component from "@glimmer/component";
import { inject as controller } from "@ember/controller";
import { action } from "@ember/object";
import { service } from "@ember/service";

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
