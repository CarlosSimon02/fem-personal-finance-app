"use client";

import { BudgetDto } from "@/core/schemas/budgetSchema";
import { IncomeDto } from "@/core/schemas/incomeSchema";
import { PaginationParams } from "@/core/schemas/paginationSchema";
import { TransactionType } from "@/core/schemas/transactionSchema";
import { getPaginatedBudgetsAction } from "@/presentation/actions/budgetActions";
import { getPaginatedIncomesAction } from "@/presentation/actions/incomeActions";
import { useBudgetDialogStore } from "@/presentation/stores/useBudgetDialogStore";
import { useIncomeDialogStore } from "@/presentation/stores/useIncomeDialogStore";
import { ReactElement, useCallback, useEffect, useState } from "react";
import { RefCallBack } from "react-hook-form";
import {
  GroupBase,
  MultiValue,
  OptionsOrGroups,
  SingleValue,
} from "react-select";
import {
  ComponentProps,
  UseAsyncPaginateParams,
  withAsyncPaginate,
} from "react-select-async-paginate";
import type { CreatableProps } from "react-select/creatable";
import Creatable from "react-select/creatable";

type CategoryOptionType = {
  value: string;
  label: string;
  colorTag: string;
};

type CategorySelectFieldProps = {
  value?: string;
  onChange: (categoryId: string) => void;
  transactionType: TransactionType;
  disabled?: boolean;
  selectRef: RefCallBack;
};

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

const CategoryOptionLabel = ({ label, colorTag }: CategoryOptionType) => (
  <div className="flex items-center gap-2">
    <div
      className="size-3 rounded-full"
      style={{ backgroundColor: colorTag }}
    />
    <div>{label}</div>
  </div>
);

const useCategoryOptions = (transactionType: TransactionType) => {
  const loadOptions = useCallback(
    async (
      search: string,
      prevOptions: OptionsOrGroups<
        CategoryOptionType,
        GroupBase<CategoryOptionType>
      >
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

      const response =
        transactionType === "income"
          ? await getPaginatedIncomesAction(params)
          : await getPaginatedBudgetsAction(params);

      return {
        options:
          response.data?.data.map((item) => ({
            value: item.id,
            label: item.name,
            colorTag: item.colorTag,
          })) ?? [],
        hasMore: response.data?.meta.pagination.nextPage !== null,
      };
    },
    [transactionType]
  );

  return { loadOptions };
};

const useCategoryDialogs = (transactionType: TransactionType) => {
  const [isAddingInProgress, setIsAddingInProgress] = useState(false);
  const [cacheUniq, setCacheUniq] = useState(0);

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

  const handleIncomeCreation = useCallback(
    (inputValue: string, onSuccess: (option: CategoryOptionType) => void) => {
      setIncomeIsOpen(true);
      setIncomeInitialData({ name: inputValue });

      setIncomeCallbackFn((newCategory: IncomeDto) => {
        setIsAddingInProgress(false);
        setCacheUniq((prev) => prev + 1);

        const newOption: CategoryOptionType = {
          value: newCategory.id,
          label: newCategory.name,
          colorTag: newCategory.colorTag,
        };

        onSuccess(newOption);
      });

      setIncomeCloseCallbackFn(() => {
        setIsAddingInProgress(false);
      });
    },
    [
      setIncomeIsOpen,
      setIncomeInitialData,
      setIncomeCallbackFn,
      setIncomeCloseCallbackFn,
    ]
  );

  const handleBudgetCreation = useCallback(
    (inputValue: string, onSuccess: (option: CategoryOptionType) => void) => {
      setBudgetIsOpen(true);
      setBudgetInitialData({ name: inputValue });

      setBudgetCallbackFn((newCategory: BudgetDto) => {
        setIsAddingInProgress(false);
        setCacheUniq((prev) => prev + 1);

        const newOption: CategoryOptionType = {
          value: newCategory.id,
          label: newCategory.name,
          colorTag: newCategory.colorTag,
        };

        onSuccess(newOption);
      });

      setBudgetCloseCallbackFn(() => {
        setIsAddingInProgress(false);
      });
    },
    [
      setBudgetIsOpen,
      setBudgetInitialData,
      setBudgetCallbackFn,
      setBudgetCloseCallbackFn,
    ]
  );

  const handleCreateOption = useCallback(
    (inputValue: string, onSuccess: (option: CategoryOptionType) => void) => {
      setIsAddingInProgress(true);

      if (transactionType === "income") {
        handleIncomeCreation(inputValue, onSuccess);
      } else {
        handleBudgetCreation(inputValue, onSuccess);
      }
    },
    [transactionType, handleIncomeCreation, handleBudgetCreation]
  );

  useEffect(() => {
    setCacheUniq((prev) => prev + 1);
  }, [transactionType]);

  return {
    isAddingInProgress,
    cacheUniq,
    handleCreateOption,
  };
};

const useCategorySelection = (
  value?: string,
  onChange?: (categoryId: string) => void
) => {
  const [selectedOption, setSelectedOption] =
    useState<SingleValue<CategoryOptionType>>(null);

  const handleChange = useCallback(
    (
      newValue: MultiValue<CategoryOptionType> | SingleValue<CategoryOptionType>
    ) => {
      // Cast to SingleValue since this is a single-select component
      const singleValue = newValue as SingleValue<CategoryOptionType>;
      setSelectedOption(singleValue);
      onChange?.(singleValue?.value ?? "");
    },
    [onChange]
  );

  useEffect(() => {
    if (!value || value === "") {
      setSelectedOption(null);
    } else if (value && (!selectedOption || selectedOption.value !== value)) {
      setSelectedOption(null);
    }
  }, [value, selectedOption]);

  return {
    selectedOption,
    setSelectedOption,
    handleChange,
  };
};

const CategorySelectField = ({
  value,
  onChange,
  transactionType,
  disabled,
  selectRef,
}: CategorySelectFieldProps) => {
  const { loadOptions } = useCategoryOptions(transactionType);
  const { isAddingInProgress, cacheUniq, handleCreateOption } =
    useCategoryDialogs(transactionType);
  const { selectedOption, setSelectedOption, handleChange } =
    useCategorySelection(value, onChange);

  const onCreateOption = useCallback(
    (inputValue: string) => {
      handleCreateOption(inputValue, (newOption) => {
        setSelectedOption(newOption);
        onChange(newOption.value);
      });
    },
    [handleCreateOption, setSelectedOption, onChange]
  );

  const categoryType = transactionType === "income" ? "income" : "budget";
  const placeholder = `Select or create a ${categoryType} category`;

  return (
    <CreatableAsyncPaginate
      isDisabled={isAddingInProgress || disabled}
      value={selectedOption}
      loadOptions={loadOptions}
      onCreateOption={onCreateOption}
      onChange={handleChange}
      cacheUniqs={[cacheUniq]}
      formatOptionLabel={CategoryOptionLabel}
      placeholder={placeholder}
      selectRef={selectRef}
    />
  );
};

export default CategorySelectField;
