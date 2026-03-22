import { useEffect, useState } from "react";

import Button from "../ui/Button";
import Input from "../ui/Input";
import Modal from "../ui/Modal";

const emptyCustomer = {
  name: "",
  email: "",
  phone: "",
  address: ""
};

export default function CustomerFormModal({
  isOpen,
  initialValues,
  onClose,
  onSubmit,
  loading,
  errorMessage
}) {
  const [formData, setFormData] = useState(emptyCustomer);
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    setFormData(initialValues || emptyCustomer);
    setLocalError("");
  }, [initialValues, isOpen]);

  const handleChange = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handleSave = async (event) => {
    event.preventDefault();

    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
      setLocalError("Please complete every customer field before saving.");
      return;
    }

    setLocalError("");
    await onSubmit(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      title={initialValues?._id ? "Edit customer" : "Add customer"}
      description="Store clean customer details so invoice creation stays quick and reliable."
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="customer-form" loading={loading}>
            Save Customer
          </Button>
        </>
      }
    >
      <form id="customer-form" className="grid gap-4 md:grid-cols-2" onSubmit={handleSave}>
        <Input
          label="Name"
          value={formData.name}
          onChange={(event) => handleChange("name", event.target.value)}
          placeholder="Acme Inc."
        />
        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(event) => handleChange("email", event.target.value)}
          placeholder="accounts@acme.com"
        />
        <Input
          label="Phone"
          value={formData.phone}
          onChange={(event) => handleChange("phone", event.target.value)}
          placeholder="+1 555-000-0000"
        />
        <Input
          label="Address"
          as="textarea"
          className="md:col-span-2"
          value={formData.address}
          onChange={(event) => handleChange("address", event.target.value)}
          placeholder="Street, city, state, zip code"
        />

        {localError || errorMessage ? (
          <p className="text-sm text-rose-500 md:col-span-2">{localError || errorMessage}</p>
        ) : null}
      </form>
    </Modal>
  );
}

