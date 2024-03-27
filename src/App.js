import React, {useCallback, useRef, useState} from "react";
import Form, {
  ButtonItem,
  GroupItem,
  SimpleItem,
  Label,
  CompareRule,
  EmailRule,
  PatternRule,
  RangeRule,
  RequiredRule,
  StringLengthRule,
  CustomRule,
} from "devextreme-react/form";
import notify from "devextreme/ui/notify";
import Validator from "devextreme/ui/validator";
import "devextreme-react/autocomplete";
import "devextreme-react/date-range-box";
import service from "./data.js";
import base58 from "bs58";

const customer = service.getCustomer();
const checkBoxOptions = {
  text: "I agree to the Terms and Conditions",
  value: false,
  width: 270,
};
const cityEditorOptions = {
  dataSource: service.getCities(),
  valueChangeEvent: "keyup",
  minSearchLength: 2,
};
const countryEditorOptions = {
  dataSource: service.getCountries(),
};
const emailEditorOptions = {
  valueChangeEvent: "keyup",
};
const nameEditorOptions = {
  valueChangeEvent: "keyup",
};
const addressEditorOptions = {
  valueChangeEvent: "keyup",
};
const phoneEditorOptions = {
  mask: "+1 (X00) 000-0000",
  valueChangeEvent: "keyup",
  maskRules: {
    X: /[02-9]/,
  },
  maskInvalidMessage: "The phone must have a correct USA phone format",
};
const noDigitsPattern = /^[^0-9]+$/;
const phonePattern = /^[02-9]\d{9}$/;
const amountInputPattern = /^\d*\.?\d*$/;
const walletPattern = ({value}) => {
  try {
    const decoded = base58.decode(value);
    return decoded.length == 32;
  } catch (error) {
    return false;
  }
};
const colCountByScreen = {
  xs: 2,
  sm: 2,
  md: 2,
  lg: 2,
};
const maxDate = new Date().setFullYear(new Date().getFullYear() - 21);
const dateBoxOptions = {
  placeholder: "Birth Date",
  acceptCustomValue: false,
  openOnFieldClick: true,
};
const dateRangeBoxOptions = {
  startDatePlaceholder: "Start Date",
  endDatePlaceholder: "End Date",
  acceptCustomValue: false,
};
const passwordComparison = () => customer.Password;
const checkComparison = () => true;
const validateVacationDatesRange = ({value}) => {
  const [startDate, endDate] = value;
  if (startDate === null || endDate === null) {
    return true;
  }
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  const daysDifference = Math.abs((endDate - startDate) / millisecondsPerDay);
  return daysDifference < 3653;
};
const validateVacationDatesPresence = ({value}) => {
  const [startDate, endDate] = value;
  if (startDate === null && endDate === null) {
    return true;
  }
  return startDate !== null && endDate !== null;
};
const registerButtonOptions = {
  text: "Submit",
  type: "default",
  useSubmitBehavior: true,
  width: "120px",
};
function App() {
  const formRef = useRef(null);
  const [resetButtonOptions, setResetButtonOptions] = useState({
    disabled: true,
    icon: "refresh",
    text: "Reset",
    width: "120px",
    onClick: () => {
      formRef.current.instance.reset();
    },
  });
  const changePasswordMode = useCallback((name) => {
    const editor = formRef.current.instance.getEditor(name);
    editor.option(
      "mode",
      editor.option("mode") === "text" ? "password" : "text"
    );
  }, []);
  const getPasswordOptions = useCallback(
    () => ({
      mode: "password",
      valueChangeEvent: "keyup",
      onValueChanged: () => {
        const editor = formRef.current.instance.getEditor("ConfirmPassword");
        if (editor.option("value")) {
          const instance = Validator.getInstance(editor.element());
          instance.validate();
        }
      },
      buttons: [
        {
          name: "password",
          location: "after",
          options: {
            stylingMode: "text",
            icon: "eyeopen",
            onClick: () => changePasswordMode("Password"),
          },
        },
      ],
    }),
    [changePasswordMode]
  );
  const getConfirmOptions = useCallback(
    () => ({
      mode: "password",
      valueChangeEvent: "keyup",
      buttons: [
        {
          name: "password",
          location: "after",
          options: {
            stylingMode: "text",
            icon: "eyeopen",
            onClick: () => changePasswordMode("ConfirmPassword"),
          },
        },
      ],
    }),
    [changePasswordMode]
  );
  const handleSubmit = useCallback((e) => {
    notify(
      {
        message: "You have submitted the form",
        position: {
          my: "center top",
          at: "center top",
        },
      },
      "success",
      3000
    );
    e.preventDefault();
  }, []);
  const onOptionChanged = useCallback(
    (e) => {
      if (e.name === "isDirty") {
        setResetButtonOptions({...resetButtonOptions, disabled: !e.value});
      }
    },
    [resetButtonOptions, setResetButtonOptions]
  );
  return (
    <React.Fragment>
      <h3>Title Goes Here</h3>
      <div>Description of the project</div>
      <form action="your-action" onSubmit={handleSubmit}>
        <Form
          ref={formRef}
          formData={customer}
          readOnly={false}
          onOptionChanged={onOptionChanged}
          showColonAfterLabel={true}
          showValidationSummary={true}
          validationGroup="customerData"
        >
          {/* <GroupItem>
            <SimpleItem
              dataField="Email"
              editorType="dxTextBox"
              editorOptions={emailEditorOptions}
            >
              <RequiredRule message="Email is required" />
              <EmailRule message="Email is invalid" />
            </SimpleItem>
            <SimpleItem
              dataField="Password"
              editorType="dxTextBox"
              editorOptions={getPasswordOptions()}
            >
              <RequiredRule message="Password is required" />
            </SimpleItem>
            <SimpleItem
              name="ConfirmPassword"
              dataField="ConfirmPassword"
              editorType="dxTextBox"
              editorOptions={getConfirmOptions()}
            >
              <Label text="Confirm Password" />
              <RequiredRule message="Confirm Password is required" />
              <CompareRule
                message="Password and Confirm Password do not match"
                comparisonTarget={passwordComparison}
              />
            </SimpleItem>
          </GroupItem> */}
          <GroupItem caption="Vesting Data">
            <SimpleItem
              dataField="Receiving Wallet"
              editorOptions={nameEditorOptions}
            >
              <RequiredRule message="Receiving Wallet is required" />
              <CustomRule
                message="Input valid wallet address"
                validationCallback={walletPattern}
              />
            </SimpleItem>

            <SimpleItem dataField="Amount" editorOptions={nameEditorOptions}>
              <RequiredRule message="Amount is required" />
              <PatternRule
                message="Please input a valid amount"
                pattern={amountInputPattern}
              />
              {/* <RangeRule
                max={maxDate}
                message="You must be at least 21 years old"
              /> */}
            </SimpleItem>

            <SimpleItem
              dataField="VacationDates"
              editorType="dxDateRangeBox"
              editorOptions={dateRangeBoxOptions}
            >
              <Label text="Vesting Dates" />
              <CustomRule
                message="The vesting period must not exceed 10 years"
                validationCallback={validateVacationDatesRange}
              />
              <CustomRule
                message="Both start and end dates must be selected"
                validationCallback={validateVacationDatesPresence}
              />
            </SimpleItem>
          </GroupItem>
          {/* <GroupItem caption="Billing address">
            <SimpleItem
              dataField="Country"
              editorType="dxSelectBox"
              editorOptions={countryEditorOptions}
            >
              <RequiredRule message="Country is required" />
            </SimpleItem>
            <SimpleItem
              dataField="City"
              editorType="dxAutocomplete"
              editorOptions={cityEditorOptions}
            >
              <PatternRule
                pattern={noDigitsPattern}
                message="Do not use digits in the City name"
              />
              <StringLengthRule
                min={2}
                message="City must have at least 2 symbols"
              />
              <RequiredRule message="City is required" />
            </SimpleItem>
            <SimpleItem
              dataField="Address"
              editorOptions={addressEditorOptions}
            >
              <RequiredRule message="Address is required" />
            </SimpleItem>
            <SimpleItem
              dataField="Phone"
              helpText="Enter the phone number in USA phone format"
              editorOptions={phoneEditorOptions}
            >
              <PatternRule
                message="The phone must have a correct USA phone format"
                pattern={phonePattern}
              />
            </SimpleItem>
          </GroupItem> */}
          <GroupItem cssClass="last-group" colCountByScreen={colCountByScreen}>
            {/* <SimpleItem
              dataField="Accepted"
              editorType="dxCheckBox"
              editorOptions={checkBoxOptions}
            >
              <Label visible={false} />
              <CompareRule
                message="You must agree to the Terms and Conditions"
                comparisonTarget={checkComparison}
              />
            </SimpleItem> */}
            <GroupItem
              cssClass="buttons-group"
              colCountByScreen={colCountByScreen}
            >
              <ButtonItem buttonOptions={resetButtonOptions} name="Reset" />
              <ButtonItem buttonOptions={registerButtonOptions} />
            </GroupItem>
          </GroupItem>
        </Form>
      </form>
    </React.Fragment>
  );
}
export default App;
