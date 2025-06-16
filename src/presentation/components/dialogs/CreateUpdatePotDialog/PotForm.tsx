"use client";

import {
  CreatePotDto,
  createPotSchema,
  PotDto,
  UpdatePotDto,
} from "@/core/schemas/potSchema";
import { Button } from "@/presentation/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/presentation/components/ui/form";
import { Input } from "@/presentation/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

type PotFormProps = {
  initialData?: PotDto;
  onSubmit: (data: CreatePotDto | UpdatePotDto) => Promise<void>;
  onCancel: () => void;
  isPending: boolean;
  operation: "create" | "update";
};

const potColors = [
  "#FF5733", // Red-Orange
  "#33A1FF", // Blue
  "#4CAF50", // Green
  "#FF9800", // Orange
  "#9C27B0", // Purple
  "#2196F3", // Light Blue
  "#795548", // Brown
  "#607D8B", // Blue Grey
  "#E91E63", // Pink
  "#009688", // Teal
  "#FFEB3B", // Yellow
  "#8BC34A", // Light Green
];

export const PotForm = ({
  initialData,
  onSubmit,
  onCancel,
  isPending,
  operation,
}: PotFormProps) => {
  const form = useForm<CreatePotDto>({
    resolver: zodResolver(createPotSchema),
    defaultValues: {
      name: initialData?.name || "",
      colorTag: initialData?.colorTag || potColors[0],
      target: initialData?.target || 0,
    },
  });

  const handleSubmit = async (data: CreatePotDto) => {
    await onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pot Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Vacation Fund" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="target"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Target Amount</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="e.g. 50000"
                  step="0.01"
                  min="0"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="colorTag"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Color Theme</FormLabel>
              <FormControl>
                <div className="grid grid-cols-6 gap-2">
                  {potColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`h-8 w-8 rounded-full border-2 ${
                        field.value === color
                          ? "border-foreground"
                          : "border-transparent"
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => field.onChange(color)}
                    />
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isPending}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending} className="flex-1">
            {isPending
              ? operation === "create"
                ? "Creating..."
                : "Updating..."
              : operation === "create"
                ? "Create Pot"
                : "Update Pot"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
