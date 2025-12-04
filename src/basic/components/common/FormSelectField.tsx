import { Selector } from "./Selector";

interface FormSelectFieldProps<T> {
  fieldName: string;
  value: string | number;
  options: T[];
  valueKey: keyof T;
  labelKey: keyof T;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const FormSelectField = <T extends object>({
  fieldName,
  value,
  options = [],
  valueKey,
  labelKey,
  onChange,
}: FormSelectFieldProps<T>) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {fieldName}
      </label>
      <Selector
        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm"
        value={value}
        onChange={onChange}
        options={options}
        valueKey={valueKey}
        labelKey={labelKey}
      />
    </div>
  );
};
