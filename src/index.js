const _require = eval('require'); // don't use webpack on these `require`s before bundling

const { h } = _require('virtual-dom');
const showModal = _require('discourse/lib/show-modal').default;

const { detectUnformattedCode } = require('./detectCode.js')

api.modifyClass('model:composer', {
  ucd_previousWarningIgnored: false,

  ucd_shouldPermanentlyDismiss: false,

  ucd_checkPermanentlyDismissed: () => !!localStorage.ucd_warningPermanentlyDismissed,

  ucd_shouldIgnoreWarning: Ember.computed(
    'ucd_previousWarningIgnored',
    function() {
      return this.ucd_previousWarningIgnored || this.ucd_checkPermanentlyDismissed();
    }
  ),

  ucd_checkUnformattedCodeDetected: function() {
    return detectUnformattedCode(this.reply);
  },

  cantSubmitPost: Ember.computed(
    'ucd_shouldIgnoreWarning',
    function() {
      return (this.ucd_checkUnformattedCodeDetected() && !this.ucd_shouldIgnoreWarning) ? true : this._super();
    }
  ),
});

api.modifyClass('controller:composer', {
  save(...args) {
    const model = this.model;

    if (model.ucd_checkUnformattedCodeDetected() && !model.ucd_checkPermanentlyDismissed()) {
      const warningModal = showModal('ucdWarningModal', {
        modalClass: 'ucd_warning-modal',
        model
      });

      const _super = this._super;

      warningModal.actions.ignoreAndProceed = () => {
        model.set('ucd_previousWarningIgnored', true);

        if (model.ucd_shouldPermanentlyDismiss) {
          this.ucd_permanentlyDismiss();
        }

        this.send('closeModal');
        _super.call(this, ...args);
      };

      warningModal.actions.goBackAndFix = () => {
        model.set('ucd_previousWarningIgnored', false);
        this.send('closeModal');
      };

    } else {
      return this._super(...args);
    }
  },

  ucd_permanentlyDismiss() {
    localStorage.ucd_warningPermanentlyDismissed = '1';
  },

  ucd_permanentlyUndismiss() { // mainly for debugging
    localStorage.removeItem('ucd_warningPermanentlyDismissed');
  },

});
