interface FormInputFieldProps {
  fieldName: string;
  value: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement, Element>) => void;
  placeholder?: string;
  required?: boolean; // required 속성 제어 가능하도록 추가
}

export const FormInputField = ({
  fieldName,
  value,
  onChange,
  onBlur,
  placeholder,
  required = true, // 기본값은 true (기존 동작 유지)
}: FormInputFieldProps) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {fieldName}
      </label>
      <input
        type="text"
        value={value}
        onChange={onChange}
        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border"
        onBlur={onBlur}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
};
