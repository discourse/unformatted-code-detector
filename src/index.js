const { h } = require('virtual-dom');
const showModal = require('discourse/lib/show-modal').default;

// window.detectUnformattedCode = detectUnformattedCode;

api.modifyClass('model:composer', {
  ucd_previousWarningIgnored: false,

  ucd_warningPermanentlyDismissed: !!localStorage.ucd_warningPermanentlyDismissed,

  ucd_shouldIgnoreWarning: Ember.computed(
    'ucd_previousWarningIgnored',
    'ucd_warningPermanentlyDismissed',
    function() {
      return this.ucd_previousWarningIgnored || this.ucd_warningPermanentlyDismissed;
    }
  ),

  ucd_unformattedCodeDetected: Ember.computed(
    'reply',
    function() {
      return detectUnformattedCode(this.reply);
    }
  ),

  cantSubmitPost: Ember.computed(
    'ucd_unformattedCodeDetected',
    'ucd_shouldIgnoreWarning',
    function() {
      return (this.ucd_unformattedCodeDetected && !this.ucd_shouldIgnoreWarning) ? true : this._super();
    }
  ),
});

api.modifyClass('controller:composer', {
  save(...args) {
    const model = this.model;

    if (model.ucd_unformattedCodeDetected && !model.ucd_warningPermanentlyDismissed) {
      console.log(showModal('ucdWarningModal'));


      // model.set('ucd_previousWarningIgnored', window.confirm('Unformatted code detected. Post anyway?'));
    }

    return this._super(...args);
  },

  ucd_permanentlyDismiss() {
    const model = this.model;
    localStorage.ucd_warningPermanentlyDismissed = '1';
    model.ucd_warningPermanentlyDismissed = true;
  },

  ucd_permanentlyUndismiss() {
    const model = this.model;
    localStorage.removeItem('ucd_warningPermanentlyDismissed');
    model.ucd_warningPermanentlyDismissed = false;
  },

});
