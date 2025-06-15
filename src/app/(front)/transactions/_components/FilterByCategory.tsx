"use client";

import { trpc } from "@/presentation/trpc/client";
import { useCallback } from "react";
import { GroupBase, OptionsOrGroups } from "react-select";
import { AsyncPaginate } from "react-select-async-paginate";
import { useFilterByCategory } from "../_stores/useFilterByCategory";

type OptionType = {
  value: string;
  label: string;
};

type FilterByCategoryProps = {
  value: OptionType | null;
  onChange: (value: OptionType | null) => void;
};

const FilterByCategory = ({ value, onChange }: FilterByCategoryProps) => {
  const { cacheUniq } = useFilterByCategory();
  const trpcUtils = trpc.useUtils();

  const loadOptions = useCallback(
    async (
      search: string,
      prevOptions: OptionsOrGroups<OptionType, GroupBase<OptionType>>
    ) => {
      const limitPerPage = 10;
      const page = Math.floor(prevOptions.length / limitPerPage) + 1;

      try {
        const response = await trpcUtils.client.getPaginatedCategories.query({
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

        const options = response.data
          ? response.data.map((item) => ({
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
          hasMore: response.meta?.pagination.nextPage !== null,
        };
      } catch (error) {
        throw new Error(
          `Error fetching categories: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    },
    [trpcUtils]
  );

  return (
    <AsyncPaginate
      debounceTimeout={300}
      value={value}
      loadOptions={loadOptions}
      onChange={onChange}
      instanceId="add-expense-Subscription-Interval"
      cacheUniqs={[cacheUniq]}
      isSearchable={false}
    />
  );
};

export default FilterByCategory;
