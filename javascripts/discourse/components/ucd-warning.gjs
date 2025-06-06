import Component from "@glimmer/component";
import { Input } from "@ember/component";
import { inject as controller } from "@ember/controller";
import { on } from "@ember/modifier";
import { action } from "@ember/object";
import { service } from "@ember/service";
import CookText from "discourse/components/cook-text";
import DButton from "discourse/components/d-button";
import { i18n } from "discourse-i18n";

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

  <template>
    <CookText @rawText={{i18n (themePrefix "warning_modal.content")}} />
    <label for="ucd_do-not-show-again" class="checkbox-label">
      <Input
        @type="checkbox"
        id="ucd_do-not-show-again"
        name="ucd_do-not-show-again"
        @checked={{readonly this.shouldPermanentlyDismiss}}
        {{on "change" this.toggleShouldPermanentlyDismiss}}
      />
      {{i18n (themePrefix "warning_modal.do_not_show_again")}}
    </label>
    <div class="action-buttons">
      <DButton
        @action={{this.goBackAndFix}}
        @icon="pencil"
        class="btn-primary"
        @label={{themePrefix "warning_modal.fix_post"}}
      />
      <DButton
        @action={{this.ignoreAndProceed}}
        @label={{themePrefix "warning_modal.ignore_and_post_anyway"}}
      />
    </div>
  </template>
}
