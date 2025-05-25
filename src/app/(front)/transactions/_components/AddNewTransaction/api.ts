import getPaginatedBudgetsAction from "@/app/(front)/_actions/getPaginatedBudgetsAction";
import type { GroupBase, OptionsOrGroups } from "react-select";

export type OptionType = {
  value: string | number;
  label: string;
};

const options: OptionType[] = [];
for (let i = 0; i < 50; ++i) {
  options.push({
    value: i + 1,
    label: `Option ${i + 1}`,
  });
}

const sleep = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(undefined);
    }, ms);
  });

export const loadOptions = async (
  search: string,
  prevOptions: OptionsOrGroups<OptionType, GroupBase<OptionType>>
) => {
  const limitPerPage = 10;
  const response = await getPaginatedBudgetsAction({
    sort: {
      field: "name",
      order: "asc",
    },
    pagination: {
      page: Math.floor(prevOptions.length / limitPerPage) + 1,
      limitPerPage,
    },
    filters: [],
    search,
  });

  return {
    options:
      response.data?.data.map((item) => ({
        value: item.id,
        label: item.name,
        colorTag: item.colorTag,
      })) ?? [],
    hasMore: response.data?.meta.pagination.nextPage !== null,
  };
};

export const addNewOption = async (inputValue: string) => {
  await sleep(1000);

  const newOption = {
    label: inputValue,
    value: inputValue,
  };

  options.push(newOption);

  return newOption;
};
