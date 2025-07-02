import CustomSelect from "../components/customInputs/CustomSelect";

function BioManagement() {
  return (
    <div>
      <CustomSelect
        defaultValue="aaaaaaaaaaaaaaa"
        options={[
          { content: "eeeeee", value: "e" },
          { content: "ffff", value: "f" },
          { content: "ffff", value: "f" },
          { content: "ffff", value: "f" },
          { content: "ffff", value: "f" },
          { content: "ffff", value: "f" },
          { content: "ffff", value: "f" },
          { content: "ffff", value: "f" },
          { content: "ffff", value: "f" },
        ]}
      />
    </div>
  );
}

export default BioManagement;
