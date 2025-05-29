"use client";

import { getPaginatedCategoriesAction } from "@/presentation/actions/transactionActions";
import { useCallback } from "react";
import { GroupBase, OptionsOrGroups } from "react-select";
import { AsyncPaginate } from "react-select-async-paginate";

type OptionType = {
  value: string;
  label: string;
};

type FilterByCategoryProps = {
  value: OptionType | null;
  onChange: (value: OptionType | null) => void;
};

const FilterByCategory = ({ value, onChange }: FilterByCategoryProps) => {
  const loadOptions = useCallback(
    async (
      search: string,
      prevOptions: OptionsOrGroups<OptionType, GroupBase<OptionType>>
    ) => {
      const limitPerPage = 10;
      const page = Math.floor(prevOptions.length / limitPerPage) + 1;
      const response = await getPaginatedCategoriesAction({
        sort: {
          field: "createdAt",
          order: "desc",
        },
        pagination: {
          page,
          limitPerPage,
        },
        filters: [],
        search,
      });

      if (response.error) {
        throw new Error(`Error fetching categories: ${response.error}`);
      }

      const options = response.data
        ? response.data.data.map((item) => ({
            value: item.name,
            label: item.name,
          }))
        : [];

      if (page === 1) {
        options.unshift({
          value: "All Transactions",
          label: "All Transactions",
        });
      }

      return {
        options,
        hasMore: response.data?.meta.pagination.nextPage !== null,
      };
    },
    []
  );

  return (
    <AsyncPaginate
      debounceTimeout={300}
      value={value}
      loadOptions={loadOptions}
      onChange={onChange}
      instanceId="add-expense-Subscription-Interval"
    />
  );
};

export default FilterByCategory;
