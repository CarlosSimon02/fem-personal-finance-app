import Select from "react-select";

type SortOption = {
  value: string;
  label: string;
};

type SortSelectorProps = {
  value: SortOption | null;
  onChange: (value: SortOption | null) => void;
};

export const sortOptions: SortOption[] = [
  { value: "transactionDate-desc", label: "Latest" },
  { value: "transactionDate-asc", label: "Oldest" },
  { value: "recipientOrPayer-asc", label: "A to Z" },
  { value: "recipientOrPayer-desc", label: "Z to A" },
  { value: "signedAmount-desc", label: "Highest" },
  { value: "signedAmount-asc", label: "Lowest" },
];

const SortSelector = ({ value, onChange }: SortSelectorProps) => {
  return (
    <Select
      classNamePrefix="select"
      value={value}
      onChange={onChange}
      isDisabled={false}
      isLoading={false}
      isClearable={false}
      isSearchable={false}
      name="sort"
      options={sortOptions}
      instanceId="sort-selector"
    />
  );
};

export default SortSelector;
