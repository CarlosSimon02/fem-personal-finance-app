"use client";

import { TransactionType } from "@/core/schemas/transactionSchema";
import { ReactElement, useCallback, useEffect } from "react";
import { RefCallBack } from "react-hook-form";
import { GroupBase } from "react-select";
import {
  ComponentProps,
  UseAsyncPaginateParams,
  withAsyncPaginate,
} from "react-select-async-paginate";
import type { CreatableProps } from "react-select/creatable";
import Creatable from "react-select/creatable";
import CreateUpdateBudgetDialog from "../../CreateUpdateBudgetDialog";
import CreateUpdateIncomeDialog from "../../CreateUpdateIncomeDialog";
import { CategoryOptionType } from "./types";
import {
  useCategoryDialogs,
  useCategoryOptions,
  useCategorySelection,
} from "./useCategorySelectField";

type CategorySelectFieldProps = {
  value?: string;
  onChange: (categoryId: string) => void;
  transactionType: TransactionType;
  disabled?: boolean;
  selectRef: RefCallBack;
  initialData?: CategoryOptionType;
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

const CategorySelectField = ({
  value,
  onChange,
  transactionType,
  disabled,
  selectRef,
  initialData,
}: CategorySelectFieldProps) => {
  const { loadOptions } = useCategoryOptions(transactionType);
  const {
    isAddingInProgress,
    cacheUniq,
    handleCreateOption,
    isBudgetDialogOpen,
    isIncomeDialogOpen,
    initialDialogData,
    handleBudgetSuccess,
    handleIncomeSuccess,
    handleDialogClose,
  } = useCategoryDialogs(transactionType);
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

  useEffect(() => {
    if (initialData) {
      setSelectedOption(initialData);
    }
  }, [initialData, setSelectedOption]);

  const categoryType = transactionType === "income" ? "income" : "budget";
  const placeholder = `Select or create a ${categoryType} category`;

  return (
    <>
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

      <CreateUpdateBudgetDialog
        title="Create New Budget"
        description="Create a new budget to track your spending."
        operation="create"
        initialData={initialDialogData || undefined}
        open={isBudgetDialogOpen}
        onOpenChange={(open: boolean) => {
          if (!open) {
            handleDialogClose();
          }
        }}
        onSuccess={handleBudgetSuccess}
        onClose={handleDialogClose}
      />

      <CreateUpdateIncomeDialog
        title="Create New Income"
        description="Create a new income category to track your earnings."
        operation="create"
        initialData={initialDialogData || undefined}
        open={isIncomeDialogOpen}
        onOpenChange={(open: boolean) => {
          if (!open) {
            handleDialogClose();
          }
        }}
        onSuccess={handleIncomeSuccess}
        onClose={handleDialogClose}
      />
    </>
  );
};

export default CategorySelectField;
