"use client";

import getPaginatedBudgetsAction from "@/app/(front)/_actions/getPaginatedBudgetsAction";
import getPaginatedIncomesAction from "@/app/(front)/_actions/getPaginatedIncomesAction";
import {
  BudgetDto,
  PaginatedBudgetsResponse,
} from "@/core/schemas/budgetSchema";
import {
  IncomeDto,
  PaginatedIncomesResponse,
} from "@/core/schemas/incomeSchema";
import { PaginationParams } from "@/core/schemas/paginationSchema";
import { TransactionType } from "@/core/schemas/transactionSchema";
import { useBudgetDialogStore } from "@/presentation/stores/useBudgetDialogStore";
import { useIncomeDialogStore } from "@/presentation/stores/useIncomeDialogStore";
import { ReactElement, useEffect, useState } from "react";
import { GroupBase, OptionsOrGroups } from "react-select";
import {
  ComponentProps,
  UseAsyncPaginateParams,
  withAsyncPaginate,
} from "react-select-async-paginate";
import type { CreatableProps } from "react-select/creatable";
import Creatable from "react-select/creatable";

type OptionType = {
  value: string;
  label: string;
  colorTag: string;
};

interface CategorySelectFieldProps {
  value?: string;
  onChange: (categoryId: string) => void;
  transactionType: TransactionType;
  disabled?: boolean;
}

type Additional = {
  page: number;
};

type AsyncPaginateCreatableProps<
  OptionType,
  Group extends GroupBase<OptionType>,
  IsMulti extends boolean,
> = CreatableProps<OptionType, IsMulti, Group> &
  UseAsyncPaginateParams<OptionType, Group, Additional> &
  ComponentProps<OptionType, Group, IsMulti>;

type AsyncPaginateCreatableType = <
  OptionType,
  Group extends GroupBase<OptionType>,
  IsMulti extends boolean = false,
>(
  props: AsyncPaginateCreatableProps<OptionType, Group, IsMulti>
) => ReactElement;

const CreatableAsyncPaginate = withAsyncPaginate(
  Creatable
) as AsyncPaginateCreatableType;

const increaseUniq = (uniq: number) => uniq + 1;

export const CategorySelectField = ({
  value,
  onChange,
  transactionType,
  disabled,
}: CategorySelectFieldProps) => {
  const [cacheUniq, setCacheUniq] = useState(0);
  const [isAddingInProgress, setIsAddingInProgress] = useState(false);
  const [selectedOption, setSelectedOption] = useState<OptionType | null>(null);
  const {
    setIsOpen: setIncomeIsOpen,
    setCallbackFn: setIncomeCallbackFn,
    setCloseCallbackFn: setIncomeCloseCallbackFn,
    setInitialData: setIncomeInitialData,
  } = useIncomeDialogStore();
  const {
    setIsOpen: setBudgetIsOpen,
    setCallbackFn: setBudgetCallbackFn,
    setCloseCallbackFn: setBudgetCloseCallbackFn,
    setInitialData: setBudgetInitialData,
  } = useBudgetDialogStore();

  const loadOptions = async (
    search: string,
    prevOptions: OptionsOrGroups<OptionType, GroupBase<OptionType>>
  ) => {
    const limitPerPage = 10;
    const params: PaginationParams = {
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
    };
    let response: ServerActionResponse<
      PaginatedIncomesResponse | PaginatedBudgetsResponse
    >;

    if (transactionType === "income") {
      response = await getPaginatedIncomesAction(params);
    } else {
      response = await getPaginatedBudgetsAction(params);
    }

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

  const formatOptionLabel = ({ label, colorTag }: OptionType) => (
    <div className="flex items-center gap-2">
      <div
        className="size-3 rounded-full"
        style={{ backgroundColor: colorTag }}
      />
      <div>{label}</div>
    </div>
  );

  const onCreateOption = (inputValue: string) => {
    setIsAddingInProgress(true);

    // Open the appropriate dialog based on transaction type
    if (transactionType === "income") {
      setIncomeIsOpen(true);
      setIncomeInitialData({
        name: inputValue,
      });
      setIncomeCallbackFn((newCategory: IncomeDto) => {
        console.log(newCategory, "this is the new category");
        setIsAddingInProgress(false);
        setCacheUniq(increaseUniq);

        // Convert the new category to an option
        const newOption: OptionType = {
          value: newCategory.id,
          label: newCategory.name,
          colorTag: newCategory.colorTag,
        };

        setSelectedOption(newOption);
        onChange(newOption.value);
      });
      setIncomeCloseCallbackFn(() => {
        setIsAddingInProgress(false);
      });
    } else {
      setBudgetIsOpen(true);
      setBudgetInitialData({
        name: inputValue,
      });
      setBudgetCallbackFn((newCategory: BudgetDto) => {
        console.log(newCategory, "this is the new category");
        setIsAddingInProgress(false);
        setCacheUniq(increaseUniq);

        // Convert the new category to an option
        const newOption: OptionType = {
          value: newCategory.id,
          label: newCategory.name,
          colorTag: newCategory.colorTag,
        };

        setSelectedOption(newOption);
        onChange(newOption.value);
      });
      setBudgetCloseCallbackFn(() => {
        setIsAddingInProgress(false);
      });
    }
  };

  // Handle changes from the select
  const handleChange = (newValue: OptionType | null) => {
    setSelectedOption(newValue);
    if (newValue) {
      onChange(newValue.value);
    }
  };

  // Initialize selected option from value prop
  useEffect(() => {
    if (value && !selectedOption) {
      // In a real app, you would fetch the category details if not available
      // For now, we'll leave it as null and it will be populated when options load
    }
  }, [value, selectedOption]);

  useEffect(() => {
    setCacheUniq(increaseUniq);
  }, [transactionType]);

  return (
    <CreatableAsyncPaginate
      isDisabled={isAddingInProgress || disabled}
      value={selectedOption}
      loadOptions={loadOptions}
      onCreateOption={onCreateOption}
      onChange={handleChange}
      cacheUniqs={[cacheUniq]}
      formatOptionLabel={formatOptionLabel}
      placeholder={`Select or create a ${transactionType === "income" ? "income" : "budget"} category`}
    />
  );
};
