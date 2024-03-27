import Service from "@ember/service";
import KeyValueStore from "discourse/lib/key-value-store";

const DISMISSED = "permanently_dismissed";
const NAMESPACE = "ucd_";

export default class extends Service {
  store = new KeyValueStore(NAMESPACE);

  get permanentlyDismissed() {
    return this.store.getObject(DISMISSED) || false;
  }

  toggle() {
    this.store.setObject({ key: DISMISSED, value: !this.permanentlyDismissed });
  }
}
