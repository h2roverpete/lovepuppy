import AddressFields from "../forms/AddressFields";
import PhoneNumberField from "../forms/PhoneNumberField";
import ContactMethod from "./ContactMethod";

/**
 * Display guest fields from the guest book database.
 *
 * @param guestBookConfig {GuestBookConfig}
 * @param guestData {GuestData}
 * @param onChange {DataCallback}
 * @constructor
 */
function GuestFields({guestBookConfig, guestData, onChange}) {
    return (
        <>
            {guestBookConfig?.ShowName && (
                <div className="form-group row align-bottom">
                    <div className="form-group col-xs-12 col-sm-6 mt-2">
                        <label className="form-label" htmlFor="firstname">First Name</label>
                        <input
                            type="text"
                            className={"form-control" + (guestData.FirstName != null ? guestData.FirstName.length ? " is-valid" : " is-invalid" : "")}
                            name="firstname"
                            id="firstname"
                            size="20"
                            value={guestData.FirstName}
                            onChange={e => onChange({
                                name: 'FirstName',
                                value: e.target.value !== null ? e.target.value : ""
                            })}
                            onBlur={e => onChange({
                                name: 'FirstName',
                                value: e.target.value !== null ? e.target.value : ""
                            })}
                            required={true}
                        />

                    </div>
                    <div className="form-group col-xs-12 col-sm-6 mt-2">
                        <label className="form-label" htmlFor="lastname">Last Name</label>
                        <input
                            type="text"
                            className={"form-control" + (guestData.LastName != null ? guestData.LastName.length ? " is-valid" : " is-invalid" : "")}
                            name="lastname"
                            id="lastname"
                            size="20"
                            value={guestData.LastName}
                            onChange={e => onChange({
                                name: 'LastName',
                                value: e.target.value !== null ? e.target.value : ""
                            })}
                            onBlur={e => onChange({
                                name: 'LastName',
                                value: e.target.value !== null ? e.target.value : ""
                            })}
                            required={true}
                        />
                    </div>
                </div>
            )}
            {guestBookConfig?.ShowAddress && (
                <AddressFields address={guestData} onChange={(data) => onChange(data)}/>
            )}
            {guestBookConfig?.ShowDayPhone && (
                <div className="form-group col-7 col-md-4 mt-4">
                    <label className="form-label" htmlFor="dayPhone">Phone</label>
                    <PhoneNumberField
                        name="dayPhone"
                        id="dayPhone"
                        value={guestData.DayPhone}
                        onChange={value => onChange({name: 'DayPhone', value: value})}
                    />
                </div>
            )}
            {guestBookConfig?.ShowEveningPhone && (
                <div className="form-group col-7 col-md-4 mt-4">
                    <label className="form-label" htmlFor="dayPhone">Mobile</label>
                    <PhoneNumberField
                        name="eveningPhone"
                        id="eveningPhone"
                        value={guestData.EveningPhone}
                        onChange={value => onChange({name: 'EveningPhone', value: value})}
                    />
                </div>
            )}
            {guestBookConfig?.ShowFax && (
                <div className="form-group col-5 col-md-4 mt-4">
                    <label className="form-label" htmlFor="dayPhone">Alternate</label>
                    <PhoneNumberField
                        name="altPhone"
                        id="altPhone"
                        value={guestData.Fax}
                        onChange={value => onChange({name: 'Fax', value: value})}
                    />
                </div>
            )}
            {guestBookConfig?.ShowEmail && (
                <div className="form-group col-xs-8 col-md-6 mt-4">
                    <label className="form-label" htmlFor="email">Email</label>
                    <input
                        type="email"
                        className={"form-control" + (guestData.Email != null ? isValidEmail(guestData.Email) ? " is-valid" : " is-invalid" : "")}
                        name="email"
                        id="email" size="30"
                        value={guestData.Email}
                        onChange={e => onChange({
                            name: 'Email',
                            value: e.target.value !== null ? e.target.value : ""
                        })}
                        onBlur={e => onChange({
                            name: 'Email',
                            value: e.target.value !== null ? e.target.value : ""
                        })}
                        maxLength="50"
                        required={true}
                    />
                </div>
            )}
            <ContactMethod guestBookConfig={guestBookConfig} guestData={guestData} onChange={(value) => {
                onChange({name: 'ContactMethod', value: value})
            }}/>
            {guestBookConfig?.ShowMailingList && (
                <div className="form-group align-baseline">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        name="MailingList"
                        id="mailinglist"
                        value="1"
                        defaultChecked={guestData.MailingList ? guestData.MailingList : guestBookConfig.MailingListDefault}
                        onChange={e => onChange({name: 'MailingList', value: e.target.checked})}
                    />
                    <label
                        className="form-check-label mt-1"
                        htmlFor="mailinglist"
                        style={{marginLeft: '10px'}}
                    >
                        Add my email address to the mailing list
                    </label>
                </div>
            )}
        </>
    )
}

function isValidEmail(email) {
    // A common regex pattern for email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

export default GuestFields;