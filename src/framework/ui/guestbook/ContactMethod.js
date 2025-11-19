/**
 *
 * @param guestBookConfig{GuestBookConfig}
 * @param guestData{GuestData}
 * @param onChange{FunctionStringCallback}
 * @returns {JSX.Element}
 * @constructor
 */
function ContactMethod({guestBookConfig, guestData, onChange}) {

    return (
        <>
            {guestBookConfig?.ShowContactInfo && (
                <div className="form-group mt-4">
                    <label className="form-label" style={{marginRight: "20px"}}>Contact By:</label>
                    {guestBookConfig.ShowEmail && (
                        <div className="form-check-inline">
                            <input
                                type="Radio"
                                className="form-check-input"
                                name="ContactMethod"
                                id="ContactMethodEmail"
                                checked={!guestData.ContactMethod || guestData.ContactMethod === "email"}
                                onChange={() => onChange('email')}
                            />
                            <label className="form-check-label" style={{marginLeft: "10px"}} htmlFor="ContactMethodEmail">Email</label>
                        </div>
                    )}
                    {guestBookConfig.ShowDayPhone && (
                        <div className="form-check-inline">
                            <input
                                type="Radio"
                                className="form-check-input"
                                name="ContactMethod"
                                id="ContactMethodPhone"
                                checked={guestData?.ContactMethod === "phone"}
                                onChange={() => onChange('phone')}
                            />
                            <label className="form-check-label" style={{marginLeft: "10px"}} htmlFor="ContactMethodPhone">Phone</label>
                        </div>
                    )}
                    {guestBookConfig.ShowEveningPhone && (
                        <div className="form-check-inline">
                            <input
                                type="Radio"
                                className="form-check-input"
                                name="ContactMethod"
                                id="ContactMethodMobile"
                                checked={guestData?.ContactMethod === "mobile"}
                                onChange={() => onChange('mobile')}
                            />
                            <label className="form-check-label" style={{marginLeft: "10px"}} htmlFor="ContactMethodMobile">Mobile</label>
                        </div>
                    )}
                </div>
            )}
        </>
    )
}

export default ContactMethod;