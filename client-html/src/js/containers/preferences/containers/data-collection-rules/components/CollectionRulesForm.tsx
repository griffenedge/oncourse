/*
 * Copyright ish group pty ltd. All rights reserved. https://www.ish.com.au
 * No copying or use of this code is allowed without permission in writing from ish.
 */

import * as React from "react";
import Grid from "@mui/material/Grid";
import { withStyles } from "@mui/styles";
import { withRouter } from "react-router-dom";
import {
  reduxForm, initialize
} from "redux-form";
import {
  DataCollectionForm,
  DataCollectionRule,
  DataCollectionType
} from "@api/model";
import createStyles from "@mui/styles/createStyles";
import DeleteForever from "@mui/icons-material/DeleteForever";
import Button from "@mui/material/Button";
import FormField from "../../../../../common/components/form/formFields/FormField";
import CustomAppBar from "../../../../../common/components/layout/CustomAppBar";
import AppBarActions from "../../../../../common/components/form/AppBarActions";
import AppBarHelpMenu from "../../../../../common/components/form/AppBarHelpMenu";
import { validateSingleMandatoryField } from "../../../../../common/utils/validation";
import RouteChangeConfirm from "../../../../../common/components/dialog/confirm/RouteChangeConfirm";
import { sortDefaultSelectItems } from "../../../../../common/utils/common";
import { getManualLink } from "../../../../../common/utils/getManualLink";
import FormSubmitButton from "../../../../../common/components/form/FormSubmitButton";
import { onSubmitFail } from "../../../../../common/utils/highlightFormClassErrors";

const manualLink = getManualLink("dataCollection");

const styles = () =>
  createStyles({
    selectField: {
      paddingRight: "60px"
    }
  });

interface Props {
  item: DataCollectionRule;
  value: DataCollectionRule;
  onUpdate: (id: string, rule: DataCollectionRule) => void;
  onDelete: (id: string) => void;
  onAddNew: (rule: DataCollectionRule) => void;
  classes: any;
  dispatch: any;
  handleSubmit: any;
  match: any;
  history: any;
  dirty: boolean;
  invalid: boolean;
  form: string;
  collectionForms: DataCollectionForm[];
  collectionRules: DataCollectionRule[];
  onSubmit: (value) => void;
}

class CollectionRulesBaseForm extends React.Component<Props, any> {
  private resolvePromise;
  private rejectPromise;
  private unlisten;
  private promisePending: boolean = false;
  private skipValidation: boolean;

  constructor(props) {
    super(props);

    this.state = {
      disableConfirm: false
    };

    if (props.item) {
      props.dispatch(initialize("CollectionRulesForm", props.item));
    } else {
      props.dispatch(initialize("CollectionRulesForm", { id: null }));
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.promisePending && nextProps.item && (!this.props.item || this.props.item.id !== nextProps.item.id)) {
      this.props.dispatch(initialize("CollectionRulesForm", nextProps.item));
      return;
    }
    if (this.rejectPromise && nextProps.fetch && nextProps.fetch.success === false) {
      this.rejectPromise(nextProps.fetch.formError);
    }
    if (this.resolvePromise && nextProps.fetch && nextProps.fetch.success) {
      this.resolvePromise();
      this.promisePending = false;
    }
  }

  componentDidMount() {
    this.unlisten = this.props.history.listen(location => {
      this.onHistoryChange(location);
    });
  }

  componentWillUnmount() {
    this.unlisten();
  }

  onHistoryChange = location => {
    const locationParts = location.pathname.split("/");
    if (locationParts[2] === "collectionRules" && locationParts[3] === "new") {
      this.props.dispatch(initialize("CollectionRulesForm", { id: null }));
    }
  };

  getItems = (type: DataCollectionType) => {
    const { collectionForms } = this.props;

    const items = collectionForms
      && collectionForms
        .filter(filtered => filtered.type === type)
        .map(form => ({
          value: form.name,
          label: form.name
        }));

    if (items) {
      items.sort(sortDefaultSelectItems);
    }

    return items;
  };

  validateUniqueNames = (value, values) => {
    const { collectionRules, match } = this.props;

    if (!collectionRules || this.skipValidation) {
      return undefined;
    }

    if (value.includes("%")) {
      return "Special symbols not allowed";
    }

    const matching = collectionRules.filter(item => item.name.trim() === value.trim());

    if (match.params.action === "edit") {
      const filteredMatch = matching.filter(item => item.id !== values.id);
      return filteredMatch.length > 0 ? "Form name must be unique" : undefined;
    }

    return matching.length > 0 ? "Form name must be unique" : undefined;
  };

  redirectOnDelete = id => {
    const { history, collectionRules, dispatch } = this.props;

    if (collectionRules[0].id === id) {
      if (collectionRules.length > 1) {
        history.push(`/preferences/collectionRules/edit/${collectionRules[1].id}`);
        setTimeout(() => dispatch(initialize("CollectionRulesForm", collectionRules[1])), 100);

        return;
      }
      history.push("/preferences");
      return;
    }
    history.push(`/preferences/collectionRules/edit/${collectionRules[0].id}`);
    setTimeout(() => dispatch(initialize("CollectionRulesForm", collectionRules[0])), 100);
  };

  onRuleDelete = id => {
    const { onDelete } = this.props;

    this.promisePending = true;

    this.setState({
      disableConfirm: true
    });

    return new Promise((resolve, reject) => {
      this.resolvePromise = resolve;
      this.rejectPromise = reject;

      onDelete(id);
    })
      .then(() => {
        this.redirectOnDelete(id);
        this.setState({
          disableConfirm: false
        });
      })
      .catch(() => {
        this.promisePending = false;
        this.setState({
          disableConfirm: false
        });
      });
  };

  render() {
    const {
     classes, handleSubmit, match, value, dirty, form, onSubmit, invalid
    } = this.props;
    const { disableConfirm } = this.state;
    const isNew = match.params.action === "new";

    const created = value && value.created;
    const modified = value && value.modified;

    return (
      <form className="container" autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        {!disableConfirm && dirty && <RouteChangeConfirm form={form} when={dirty} />}
        <CustomAppBar>
          <Grid
            container
            classes={{
              container: classes.fitSmallWidth
            }}
          >
            <Grid item xs={12} className="centeredFlex relative">
              <FormField
                type="headerText"
                name="name"
                placeholder="Name"
                margin="none"
                className={classes.HeaderTextField}
                listSpacing={false}
                validate={[validateSingleMandatoryField, this.validateUniqueNames]}
              />

              <div className="flex-fill" />
              {!isNew && (
                <AppBarActions
                  actions={[
                    {
                      action: () => {
                        this.onRuleDelete(value.id);
                      },
                      icon: <DeleteForever />,

                      tooltip: "Delete form",
                      confirmText: "Rule will be deleted permanently",
                      confirmButtonText: "DELETE"
                    }
                  ]}
                />
              )}

              {!isNew && value && (
                <AppBarHelpMenu
                  created={created ? new Date(created) : null}
                  modified={modified ? new Date(modified) : null}
                  auditsUrl={`audit?search=~"FieldConfigurationScheme" and entityId == ${value.id}`}
                  manualUrl={manualLink}
                />
              )}

              <FormSubmitButton
                disabled={!dirty}
                invalid={invalid}
              />
            </Grid>
          </Grid>
        </CustomAppBar>

        <Grid container columnSpacing={3}>
          <Grid item xs={12} md={10}>
            <Grid container columnSpacing={3}>
              <Grid item xs={6}>
                <FormField
                  type="select"
                  name="enrolmentFormName"
                  label="Enrolment"
                  items={this.getItems("Enrolment") || []}
                  margin="none"
                  className={classes.selectField}
                  fullWidth
                  required
                />
              </Grid>

              <Grid item xs={6}>
                <FormField
                  type="select"
                  name="surveyForms"
                  label="Student Feedback"
                  multiple
                  allowEmpty
                  items={this.getItems("Survey") || []}
                  margin="none"
                  className={classes.selectField}
                  fullWidth
                />
              </Grid>

              <Grid item xs={6}>
                <FormField
                  type="select"
                  name="applicationFormName"
                  label="Application"
                  items={this.getItems("Application") || []}
                  margin="none"
                  className={classes.selectField}
                  fullWidth
                  required
                />
              </Grid>

              <Grid item xs={6}>
                <FormField
                  type="select"
                  name="payerFormName"
                  label="Payer"
                  allowEmpty
                  items={this.getItems("Payer") || []}
                  margin="none"
                  className={classes.selectField}
                  fullWidth
                />
              </Grid>

              <Grid item xs={6}>
                <FormField
                  type="select"
                  name="waitingListFormName"
                  label="Waiting List"
                  items={this.getItems("WaitingList") || []}
                  margin="none"
                  className={classes.selectField}
                  fullWidth
                  required
                />
              </Grid>

              <Grid item xs={6}>
                <FormField
                  type="select"
                  name="parentFormName"
                  label="Parent"
                  allowEmpty
                  items={this.getItems("Parent") || []}
                  margin="none"
                  className={classes.selectField}
                  fullWidth
                />
              </Grid>

              <Grid item xs={6}>
                <FormField
                  type="select"
                  name="productFormName"
                  label="Product"
                  allowEmpty
                  items={this.getItems("Product") || []}
                  margin="none"
                  className={classes.selectField}
                  fullWidth
                  required
                />
              </Grid>

              <Grid item xs={6}>
                <FormField
                  type="select"
                  name="voucherFormName"
                  label="Voucher"
                  allowEmpty
                  items={this.getItems("Voucher") || []}
                  margin="none"
                  className={classes.selectField}
                  fullWidth
                  required
                />
              </Grid>

              <Grid item xs={6}>
                <FormField
                  type="select"
                  name="membershipFormName"
                  label="Membership"
                  allowEmpty
                  items={this.getItems("Membership") || []}
                  margin="none"
                  className={classes.selectField}
                  fullWidth
                  required
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </form>
    );
  }
}

const CollectionRulesForm = reduxForm({
  form: "CollectionRulesForm",
  onSubmitFail
})(withStyles(styles)(withRouter(CollectionRulesBaseForm)) as any);

export default CollectionRulesForm;
