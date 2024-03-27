import Component from "@glimmer/component";
import { action } from "@ember/object";
import { service } from "@ember/service";
import { htmlSafe } from "@ember/template";
import { escape } from "pretty-text/sanitizer";
import { emojiUnescape } from "discourse/lib/text";
import I18n from "I18n";
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
