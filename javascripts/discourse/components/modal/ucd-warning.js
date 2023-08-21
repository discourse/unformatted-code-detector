import Component from "@glimmer/component";
import { inject as service } from "@ember/service";
import { action } from "@ember/object";
import { htmlSafe } from "@ember/template";
import I18n from "I18n";
import { emojiUnescape } from "discourse/lib/text";
import { escape } from "pretty-text/sanitizer";
import { randomizeEmojiDiversity } from "../../lib/emoji-diversity";

export default class ModalUcdWarning extends Component {
  @service ucdState;

  get title() {
    return htmlSafe(
      [
        emojiUnescape(escape(randomizeEmojiDiversity(settings.emoji_icon))),
        escape(I18n.t(themePrefix("warning_modal.title"))),
      ].join(" ")
    );
  }

  @action
  closeModal() {
    if (this.args.model.ucd_shouldPermanentlyDismiss) {
      this.ucdState.permanentlyDismiss();
    }

    this.args.closeModal();
  }
}
