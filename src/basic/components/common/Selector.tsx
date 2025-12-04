interface SelectorProps<T> {
  className?: string;
  defaultValue?: string;
  value?: string | number;
  options: T[];
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  valueKey: keyof T; // option value로 쓸 필드
  labelKey: keyof T; // option label로 쓸 필드
}

export const Selector = <T extends object>({
  className,
  defaultValue,
  value,
  options: data,
  valueKey,
  labelKey,
  onChange,
}: SelectorProps<T>) => {
  return (
    <select
      className={`w-full text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 ${className}`}
      value={value || ""}
      onChange={onChange}>
      {defaultValue && <option value="">{defaultValue}</option>}
      {data.map((item) => (
        <option key={String(item[valueKey])} value={String(item[valueKey])}>
          {String(item[labelKey])}
        </option>
      ))}
    </select>
  );
};
