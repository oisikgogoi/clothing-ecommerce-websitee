import { useState } from "react";
import { useRecoilValue } from "recoil";
import emailjs from "emailjs-com";
import { cartItemState, totalCostState } from "../states/atom";
import { useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  const totalCost = useRecoilValue(totalCostState);
  const cartItems = useRecoilValue(cartItemState);
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    state: "",
  });

  const [hasError, setHasError] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({ email: "", phone: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
    const phoneValid = /^\d{10}$/.test(formData.phone);
    const postalValid = /^[0-9]{6}$/.test(formData.postalCode);

    const newFieldErrors = {
      email: formData.email && !emailValid ? "Invalid email format" : "",
      phone: formData.phone && !phoneValid ? "Phone number must be 10 digits" : "",
    };

    setFieldErrors(newFieldErrors);

    if (
      !formData.fullName.trim() ||
      !formData.email.trim() ||
      !emailValid ||
      !formData.phone.trim() ||
      !phoneValid ||
      !formData.address.trim() ||
      !formData.city.trim() ||
      !formData.state.trim() ||
      !postalValid
    ) {
      return true;
    }
    return false;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "phone") {
      newValue = value.replace(/[^\d]/g, "").slice(0, 10);
    }

    if (name === "postalCode") {
      newValue = value.replace(/[^\d]/g, "").slice(0, 6);
    }

    setFormData({ ...formData, [name]: newValue });

    if (name === "email") {
      setFieldErrors((prev) => ({ ...prev, email: newValue && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newValue) ? "Invalid email format" : "" }));
    }
    if (name === "phone") {
      setFieldErrors((prev) => ({ ...prev, phone: newValue && !/^\d{10}$/.test(newValue) ? "Phone number must be 10 digits" : "" }));
    }
  };

  const handleSubmit = () => {
    const formHasError = validate();
    if (formHasError) {
      setHasError(true);
    } else {
      setHasError(false);
      setIsSubmitting(true);
      console.log("Form Submitted", formData);

      const emailData = {
        ...formData,
        totalCost: totalCost.toFixed(2),
        cartSummary: cartItems.map(item => `${item.name} =>  quantity =  ${item.quantity}`).join(" || ")
      };

      emailjs.send(
        "service_4n2f7de",
        "template_r0ymdmn",
        emailData,
        "VchF1Q42--q3zQcpX"
      ).then((response) => {
        console.log("Email sent successfully!", response.status, response.text);
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          address: "",
          city: "",
          postalCode: "",
          state: "",
        });
        navigate('/congrats')
      }).catch((err) => {
        console.error("Failed to send email", err);
        alert("Form submitted but email failed to send.");
      }).finally(() => {
        setIsSubmitting(false);
      });
    }
  };

  const renderField = (label, name, type = "text") => (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        className="w-full border border-gray-300 p-2 rounded"
        name={name}
        value={formData[name]}
        onChange={handleChange}
        placeholder={label}
        type={type}
      />
      {name in fieldErrors && (
        <div className="text-red-500 text-xs min-h-[1.25rem]">{fieldErrors[name]}</div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Billing Information</h2>
          {hasError && (
            <div className="text-red-500 text-sm mb-2">
              All fields are mandatory and must be valid.
            </div>
          )}
          <div className="space-y-4">
            {renderField("Full Name", "fullName")}
            {renderField("Email Address", "email", "email")}
            {renderField("Phone Number", "phone", "tel")}
            {renderField("Address", "address")}
            {renderField("City", "city")}
            {renderField("State", "state")}
            {renderField("Postal Code", "postalCode")}
            <button
              className="w-full bg-[var(--primary-color)] text-white py-2 px-4 rounded flex items-center justify-center"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                  checking out...
                </span>
              ) : (
                "Checkout"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
