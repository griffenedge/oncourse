/*
 * Copyright ish group pty ltd. All rights reserved. https://www.ish.com.au
 * No copying or use of this code is allowed without permission in writing from ish.
 */

import * as React from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Form, reduxForm, initialize } from "redux-form";
import isEmpty from "lodash.isempty";
import { connect } from "react-redux";
import FormField from "../../../../../common/components/form/formFields/FormField";
import { validateMultipleMandatoryFields } from "../../../../../common/utils/validation";
import { FormModelSchema } from "../../../../../model/preferences/FormModelShema";
import * as Model from "../../../../../model/preferences/ClassDefaults";
import Button from "@mui/material/Button";
import CustomAppBar from "../../../../../common/components/layout/CustomAppBar";
import RouteChangeConfirm from "../../../../../common/components/dialog/confirm/RouteChangeConfirm";
import AppBarHelpMenu from "../../../../../common/components/form/AppBarHelpMenu";
import { getManualLink } from "../../../../../common/utils/getManualLink";
import { PREFERENCES_AUDITS_LINK } from "../../../constants";
import FormSubmitButton from "../../../../../common/components/form/FormSubmitButton";
import { onSubmitFail } from "../../../../../common/utils/highlightFormClassErrors";

const manualUrl = getManualLink("generalPrefs_classdefaults");

class ClassDefaultsBaseForm extends React.Component<any, any> {
  private formModel: FormModelSchema;

  constructor(props) {
    super(props);

    // Initializing form with values
    if (!isEmpty(props.formData)) {
      props.dispatch(initialize("ClassDefaultsForm", props.formData));
    }

    this.formModel = props.formatModel(Model);
  }

  componentWillReceiveProps(nextProps) {
    // Initializing form with values
    if (!isEmpty(nextProps.formData) && !this.props.initialized) {
      this.props.dispatch(initialize("ClassDefaultsForm", nextProps.formData));
    }
  }

  render() {
    const {
     handleSubmit, onSave, dirty, enums, data, form, invalid
    } = this.props;

    return (
      <Form className="container" onSubmit={handleSubmit(onSave)}>
        <RouteChangeConfirm form={form} when={dirty} />

        <CustomAppBar>
          <Grid container columnSpacing={3}>
            <Grid item xs={12} className="centeredFlex">
              <Typography className="appHeaderFontSize" color="inherit" noWrap>
                Class Defaults
              </Typography>

              <div className="flex-fill" />

              {data && (
                <AppBarHelpMenu
                  created={data.created}
                  modified={data.modified}
                  auditsUrl={PREFERENCES_AUDITS_LINK}
                  manualUrl={manualUrl}
                />
              )}

              <FormSubmitButton
                disabled={!dirty}
                invalid={invalid}
              />
            </Grid>
          </Grid>
        </CustomAppBar>

        <Grid container columnSpacing={3} spacing={2}>
          <Grid item xs={12} sm={3}>
            <FormField
              type="number"
              name={this.formModel.ClassMinPlaces.uniqueKey}
              label="Minimum places"
              parse={val => val || "0"}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormField
              type="select"
              name={this.formModel.ClassDeliveryMode.uniqueKey}
              label="Delivery mode"
              items={enums.DeliveryMode}
              listSpacing
            />
          </Grid>
        </Grid>

        <Grid container columnSpacing={3} spacing={2}>
          <Grid item xs={12} sm={3}>
            <FormField
              type="number"
              name={this.formModel.ClassMaxPlaces.uniqueKey}
              label="Maximum places"
              parse={val => val || "0"}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormField
              type="select"
              name={this.formModel.ClassFundingSourcePreference.uniqueKey}
              label="Funding source"
              items={enums.ClassFundingSource}
              fullWidth
              listSpacing
            />
          </Grid>
        </Grid>
      </Form>
    );
  }
}

const ClassDefaultsForm = reduxForm({
  form: "ClassDefaultsForm",
  validate: validateMultipleMandatoryFields,
  onSubmitFail
})(
  connect<any, any, any>(null, null, null, { forwardRef: true })(ClassDefaultsBaseForm)
);

export default ClassDefaultsForm;
