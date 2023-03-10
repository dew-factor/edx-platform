import Backbone from 'backbone';

import HtmlUtils from 'edx-ui-toolkit/js/utils/html-utils';

import AlertListView, { mapAlertTypeToAlertHOF } from './program_alert_list_view';

import programListHeaderTpl from '../../../templates/learner_dashboard/program_list_header_view.underscore';

class ProgramListHeaderView extends Backbone.View {
  constructor(options) {
    const defaults = {
      el: '.js-program-list-header',
    };
    super(Object.assign({}, defaults, options));
  }

  initialize(options) {
    this.tpl = HtmlUtils.template(programListHeaderTpl);
    this.data = options.context;
    this.alertCollection = new Backbone.Collection(
      // TODO: get this from api
      this.data.programsData
        .map((programData) =>
          [
            { type: 'no_enrollment', url: '#' },
            { type: 'subscription_trial_expiring' },
          ].map(
            mapAlertTypeToAlertHOF('program_list', programData, {
              is_eligible_for_subscription: true,
              subscription_price: '$39',
              subscription_start_date: '2023-07-14',
              subscription_state: 'active',
              trial_end_date: '2023-07-14',
              trial_end_time: '3:54 pm',
              trial_length: 7,
            })
          )
        )
        .flat()
    );
  }

  render() {
    HtmlUtils.setHtml(this.$el, this.tpl(this.data));
    this.postRender();
  }

  postRender() {
    if (this.alertCollection.length > 0) {
      this.alertListView = new AlertListView({
        el: '.js-program-list-alerts',
        alertCollection: this.alertCollection
      });
    }
  }
}

export default ProgramListHeaderView;
