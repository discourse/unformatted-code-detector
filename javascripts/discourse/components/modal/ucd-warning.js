import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import Controller from "@ember/controller";
import Component from "@glimmer/component";

export default class ModalUcdWarning extends Component {
  @service ucdState;

  @action
  closeModal() {
    if (this.args.model.ucd_shouldPermanentlyDismiss) {
      this.ucdState.permanentlyDismiss();
    }

    this.args.closeModal();
  }
}
