export interface TabItem<T extends string> {
  key: T;
  label: string;
}

interface TabsProps<T extends string> {
  items: TabItem<T>[];
  activeKey: T;
  onChange: (key: T) => void;
}

export const Tabs = <T extends string>({
  items,
  activeKey,
  onChange,
}: TabsProps<T>) => {
  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="-mb-px flex space-x-8">
        {items.map((item) => (
          <button
            key={item.key}
            onClick={() => onChange(item.key)}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeKey === item.key
                ? "border-gray-900 text-gray-900"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}>
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
};
