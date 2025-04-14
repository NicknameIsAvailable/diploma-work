"use client";

import React from "react";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const filterSchema = z.object({
  groupIDs: z.array(z.string()).optional(),
  teacherIDs: z.array(z.string()).optional(),
  lessonIDs: z.array(z.string()).optional(),
});

type FilterFormValues = z.infer<typeof filterSchema>;

export const ScheduleFiltersForm = () => {
  const form = useForm<FilterFormValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      groupIDs: [],
      teacherIDs: [],
      lessonIDs: [],
    },
  });

  const onSubmit = (data: FilterFormValues) => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="groupIDs"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Group IDs</FormLabel>
              <FormControl>
                <Input placeholder="Enter group IDs" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="teacherIDs"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Teacher IDs</FormLabel>
              <FormControl>
                <Input placeholder="Enter teacher IDs" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lessonIDs"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lesson IDs</FormLabel>
              <FormControl>
                <Input placeholder="Enter lesson IDs" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit">Apply Filters</Button>
      </form>
    </Form>
  );
};
