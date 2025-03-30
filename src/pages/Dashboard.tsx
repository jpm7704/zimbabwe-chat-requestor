import React, { useState, useEffect } from 'react';
import { Calendar } from "@/components/ui/calendar"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label" // Properly importing Label
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { useToast } from "@/components/ui/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVertical, Copy, Edit, Delete, ChevronDown, Plus, Filter, Columns } from "lucide-react";
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createRequest,
  getRequests,
  getRequestById,
  updateRequest,
  deleteRequest,
  getEnquiries,
  getUsers,
  getRoles,
  getSystemSettings,
  updateSystemSettings,
  getLogs,
} from "@/lib/api";
import { useSearchParams } from 'react-router-dom';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { cn as m } from "@bem-react/classname";
import { useDebounce } from "@/hooks/useDebounce";
import { useToastDemo } from "@/components/ui/toast-demo"
import { useRoles } from "@/hooks/useRoles";
import { usePermissions } from "@/hooks/usePermissions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { CalendarDateRangePicker } from "@/components/ui/calendar-date-range-picker"
import { DateRange } from "react-day-picker"
import { ReloadData } from "lucide-react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  ResizableSeparator,
} from "@/components/ui/resizable"
import { X } from "lucide-react";
import { InputWithButton } from "@/components/ui/input-with-button"
import { MultiSelect } from "@/components/ui/multi-select"
import { ComboboxDemo } from "@/components/ui/combobox-demo"
import { SeparatorDemo } from "@/components/ui/separator-demo"
import { SkeletonDemo } from "@/components/ui/skeleton-demo"
import { TextareaDemo } from "@/components/ui/textarea-demo"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useHotkeys } from 'react-hotkeys-hook';
import { useTheme } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import { ModeToggle } from "@/components/mode-toggle"
import { Icons } from "@/components/icons"
import { AvatarGroup } from "@/components/ui/avatar-group"
import { CommandDemo } from "@/components/ui/command-demo"
import { ContextMenuCheckboxItem } from "@/components/ui/context-menu-checkbox-item"
import { ContextMenuContent, ContextMenuItem, ContextMenuLabel, ContextMenuSeparator, ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger, ContextMenuTrigger } from "@/components/ui/context-menu"
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, NavigationMenuViewport } from "@/components/ui/navigation-menu"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Sonner } from "@/components/ui/sonner"
import { Steps, Step } from "@/components/ui/steps"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toggle } from "@/components/ui/toggle"
import { useCopyToClipboard } from 'usehooks-ts'
import { CalendarDemo } from "@/components/ui/calendar-demo"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { DataTable } from "@/components/ui/data-table"
import { DataTableViewOptions } from "@/components/ui/data-table-view-options"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Animate } from "@/components/ui/animate"
import { BadgeDemo } from "@/components/ui/badge-demo"
import { ButtonDemo } from "@/components/ui/button-demo"
import { CalendarDateRangePickerDemo } from "@/components/ui/calendar-date-range-picker-demo"
import { CardDemo } from "@/components/ui/card-demo"
import { CarouselDemo } from "@/components/ui/carousel-demo"
import { CheckboxDemo } from "@/components/ui/checkbox-demo"
import { CollapsibleDemo } from "@/components/ui/collapsible-demo"
import { Combobox } from "@/components/ui/combobox"
import { ContextMenuDemo } from "@/components/ui/context-menu-demo"
import { DataTableDemo } from "@/components/ui/data-table-demo"
import { DialogDemo } from "@/components/ui/dialog-demo"
import { DrawerDemo } from "@/components/ui/drawer-demo"
import { DropdownMenuDemo } from "@/components/ui/dropdown-menu-demo"
import { FormDemo } from "@/components/ui/form-demo"
import { HoverCardDemo } from "@/components/ui/hover-card-demo"
import { InputDemo } from "@/components/ui/input-demo"
import { NavigationMenuDemo } from "@/components/ui/navigation-menu-demo"
import { PaginationDemo } from "@/components/ui/pagination-demo"
import { PopoverDemo } from "@/components/ui/popover-demo"
import { ProgressDemo } from "@/components/ui/progress-demo"
import { RadioGroupDemo } from "@/components/ui/radio-group-demo"
import { ResizableDemo } from "@/components/ui/resizable-demo"
import { ScrollAreaDemo } from "@/components/ui/scroll-area-demo"
import { SelectDemo } from "@/components/ui/select-demo"
import { SeparatorDemo1 } from "@/components/ui/separator-demo1"
import { SheetDemo } from "@/components/ui/sheet-demo"
import { SkeletonDemo1 } from "@/components/ui/skeleton-demo1"
import { SliderDemo } from "@/components/ui/slider-demo"
import { StepsDemo } from "@/components/ui/steps-demo"
import { SwitchDemo } from "@/components/ui/switch-demo"
import { TableDemo } from "@/components/ui/table-demo"
import { TabsDemo } from "@/components/ui/tabs-demo"
import { TextareaDemo1 } from "@/components/ui/textarea-demo1"
import { ToastDemo } from "@/components/ui/toast-demo"
import { ToggleDemo } from "@/components/ui/toggle-demo"
import { TooltipDemo } from "@/components/ui/tooltip-demo"
import { useThemeDemo } from "@/components/ui/use-theme-demo"
import {
  AlertDialogDemo,
  AlertDialogCancelDemo,
  AlertDialogActionDemo,
} from "@/components/ui/alert-dialog-demo"
import {
  AccordionDemo,
  AccordionContentDemo,
  AccordionItemDemo,
  AccordionTriggerDemo,
} from "@/components/ui/accordion-demo"
import {
  AlertDemo,
  AlertDescriptionDemo,
  AlertTitleDemo,
} from "@/components/ui/alert-demo"
import {
  AnimateDemo,
} from "@/components/ui/animate-demo"
import {
  AvatarDemo,
  AvatarFallbackDemo,
  AvatarImageDemo,
} from "@/components/ui/avatar-demo"
import {
  AvatarGroupDemo,
} from "@/components/ui/avatar-group-demo"
import {
  CarouselDemo1,
  CarouselContentDemo,
  CarouselItemDemo,
  CarouselNextDemo,
  CarouselPreviousDemo,
} from "@/components/ui/carousel-demo1"
import {
  CommandDemo1,
  CommandEmptyDemo,
  CommandGroupDemo,
  CommandInputDemo,
  CommandItemDemo,
  CommandListDemo,
  CommandSeparatorDemo,
} from "@/components/ui/command-demo1"
import {
  ContextMenuDemo1,
  ContextMenuCheckboxItemDemo,
  ContextMenuContentDemo,
  ContextMenuItemDemo,
  ContextMenuLabelDemo,
  ContextMenuSeparatorDemo,
  ContextMenuSubDemo,
  ContextMenuSubContentDemo,
  ContextMenuSubTriggerDemo,
  ContextMenuTriggerDemo,
} from "@/components/ui/context-menu-demo1"
import {
  DataTableDemo1,
  DataTableViewOptionsDemo,
} from "@/components/ui/data-table-demo1"
import {
  DialogDemo1,
  DialogContentDemo,
  DialogDescriptionDemo,
  DialogFooterDemo,
  DialogHeaderDemo,
  DialogTitleDemo,
  DialogTriggerDemo,
} from "@/components/ui/dialog-demo1"
import {
  DrawerDemo1,
  DrawerCloseDemo,
  DrawerContentDemo,
  DrawerDescriptionDemo,
  DrawerFooterDemo,
  DrawerHeaderDemo,
  DrawerTitleDemo,
  DrawerTriggerDemo,
} from "@/components/ui/drawer-demo1"
import {
  DropdownMenuDemo1,
  DropdownMenuCheckboxItemDemo,
  DropdownMenuContentDemo,
  DropdownMenuLabelDemo,
  DropdownMenuSeparatorDemo,
  DropdownMenuTriggerDemo,
} from "@/components/ui/dropdown-menu-demo1"
import {
  FormDemo1,
  FormControlDemo,
  FormDescriptionDemo,
  FormFieldDemo,
  FormItemDemo,
  FormLabelDemo,
  FormMessageDemo,
} from "@/components/ui/form-demo1"
import {
  HoverCardDemo1,
  HoverCardContentDemo,
  HoverCardTriggerDemo,
} from "@/components/ui/hover-card-demo1"
import {
  InputDemo1,
} from "@/components/ui/input-demo1"
import {
  NavigationMenuDemo1,
  NavigationMenuContentDemo,
  NavigationMenuItemDemo,
  NavigationMenuLinkDemo,
  NavigationMenuListDemo,
  NavigationMenuTriggerDemo,
  NavigationMenuViewportDemo,
} from "@/components/ui/navigation-menu-demo1"
import {
  PaginationDemo1,
  PaginationContentDemo,
  PaginationItemDemo,
  PaginationLinkDemo,
  PaginationNextDemo,
  PaginationPreviousDemo,
} from "@/components/ui/pagination-demo1"
import {
  PopoverDemo1,
  PopoverContentDemo,
  PopoverTriggerDemo,
} from "@/components/ui/popover-demo1"
import {
  ProgressDemo1,
} from "@/components/ui/progress-demo1"
import {
  RadioGroupDemo1,
  RadioGroupItemDemo,
} from "@/components/ui/radio-group-demo1"
import {
  ResizableDemo1,
  ResizableHandleDemo,
  ResizablePanelDemo,
  ResizablePanelGroupDemo,
  ResizableSeparatorDemo,
} from "@/components/ui/resizable-demo1"
import {
  ScrollAreaDemo1,
} from "@/components/ui/scroll-area-demo1"
import {
  SelectDemo1,
  SelectContentDemo,
  SelectItemDemo,
  SelectTriggerDemo,
  SelectValueDemo,
} from "@/components/ui/select-demo1"
import {
  SheetDemo1,
  SheetCloseDemo,
  SheetContentDemo,
  SheetDescriptionDemo,
  SheetFooterDemo,
  SheetHeaderDemo,
  SheetTitleDemo,
  SheetTriggerDemo,
} from "@/components/ui/sheet-demo1"
import {
  SkeletonDemo2,
} from "@/components/ui/skeleton-demo2"
import {
  SliderDemo1,
} from "@/components/ui/slider-demo1"
import {
  StepsDemo1,
  StepDemo,
} from "@/components/ui/steps-demo1"
import {
  SwitchDemo1,
} from "@/components/ui/switch-demo1"
import {
  TableDemo1,
  TableBodyDemo,
  TableCaptionDemo,
  TableCellDemo,
  TableHeadDemo,
  TableHeaderDemo,
  TableRowDemo,
} from "@/components/ui/table-demo1"
import {
  TabsDemo1,
  TabsContentDemo,
  TabsListDemo,
  TabsTriggerDemo,
} from "@/components/ui/tabs-demo1"
import {
  TextareaDemo2,
} from "@/components/ui/textarea-demo2"
import {
  ToastDemo1,
} from "@/components/ui/toast-demo1"
import {
  ToggleDemo1,
} from "@/components/ui/toggle-demo1"
import {
  TooltipDemo1,
  TooltipContentDemo,
  TooltipProviderDemo,
  TooltipTriggerDemo,
} from "@/components/ui/tooltip-demo1"
import {
  UseThemeDemo1,
} from "@/components/ui/use-theme-demo1"
import {
  CalendarDateRangePickerDemo1,
} from "@/components/ui/calendar-date-range-picker-demo1"
import {
  MultiSelectDemo,
} from "@/components/ui/multi-select-demo"
import {
  InputWithButtonDemo,
} from "@/components/ui/input-with-button-demo"
import {
  CalendarDemo1,
} from "@/components/ui/calendar-demo1"
import {
  AspectRatioDemo,
} from "@/components/ui/aspect-ratio-demo"
import {
  SeparatorDemo2,
} from "@/components/ui/separator-demo2"
import {
  ReloadDataDemo,
} from "@/components/ui/reload-data-demo"
import {
  XDemo,
} from "@/components/ui/x-demo"
import {
  PlusDemo,
} from "@/components/ui/plus-demo"
import {
  FilterDemo,
} from "@/components/ui/filter-demo"
import {
  ColumnsDemo,
} from "@/components/ui/columns-demo"
import {
  MoreVerticalDemo,
} from "@/components/ui/more-vertical-demo"
import {
  CopyDemo,
} from "@/components/ui/copy-demo"
import {
  EditDemo,
} from "@/components/ui/edit-demo"
import {
  DeleteDemo,
} from "@/components/ui/delete-demo"
import {
  ChevronDownDemo,
} from "@/components/ui/chevron-down-demo"
import {
  BadgeDemo1,
} from "@/components/ui/badge-demo1"
import {
  CheckboxDemo1,
} from "@/components/ui/checkbox-demo1"
import {
  SliderDemo2,
} from "@/components/ui/slider-demo2"
import {
  SwitchDemo2,
} from "@/components/ui/switch-demo2"
import {
  ProgressDemo2,
} from "@/components/ui/progress-demo2"
import {
  SeparatorDemo3,
} from "@/components/ui/separator-demo3"
import {
  AvatarDemo1,
  AvatarFallbackDemo1,
  AvatarImageDemo1,
} from "@/components/ui/avatar-demo1"
import {
  ScrollAreaDemo2,
} from "@/components/ui/scroll-area-demo2"
import {
  AspectRatioDemo1,
} from "@/components/ui/aspect-ratio-demo1"
import {
  HoverCardDemo2,
  HoverCardContentDemo1,
  HoverCardTriggerDemo1,
} from "@/components/ui/hover-card-demo2"
import {
  SkeletonDemo3,
} from "@/components/ui/skeleton-demo3"
import {
  UseThemeDemo2,
} from "@/components/ui/use-theme-demo2"
import {
  MultiSelectDemo1,
} from "@/components/ui/multi-select-demo1"
import {
  InputWithButtonDemo1,
} from "@/components/ui/input-with-button-demo1"
import {
  CalendarDemo2,
} from "@/components/ui/calendar-demo2"
import {
  ReloadDataDemo1,
} from "@/components/ui/reload-data-demo1"
import {
  XDemo1,
} from "@/components/ui/x-demo1"
import {
  PlusDemo1,
} from "@/components/ui/plus-demo1"
import {
  FilterDemo1,
} from "@/components/ui/filter-demo1"
import {
  ColumnsDemo1,
} from "@/components/ui/columns-demo1"
import {
  MoreVerticalDemo1,
} from "@/components/ui/more-vertical-demo1"
import {
  CopyDemo1,
} from "@/components/ui/copy-demo1"
import {
  EditDemo1,
} from "@/components/ui/edit-demo1"
import {
  DeleteDemo1,
} from "@/components/ui/delete-demo1"
import {
  ChevronDownDemo1,
} from "@/components/ui/chevron-down-demo1"
import {
  BadgeDemo2,
} from "@/components/ui/badge-demo2"
import {
  CheckboxDemo2,
} from "@/components/ui/checkbox-demo2"
import {
  SliderDemo3,
} from "@/components/ui/slider-demo3"
import {
  SwitchDemo3,
} from "@/components/ui/switch-demo3"
import {
  ProgressDemo3,
} from "@/components/ui/progress-demo3"
import {
  SeparatorDemo4,
} from "@/components/ui/separator-demo4"
import {
  AvatarDemo2,
  AvatarFallbackDemo2,
  AvatarImageDemo2,
} from "@/components/ui/avatar-demo2"
import {
  ScrollAreaDemo3,
} from "@/components/ui/scroll-area-demo3"
import {
  AspectRatioDemo2,
} from "@/components/ui/aspect-ratio-demo2"
import {
  HoverCardDemo3,
  HoverCardContentDemo2,
  HoverCardTriggerDemo2,
} from "@/components/ui/hover-card-demo3"
import {
  SkeletonDemo4,
} from "@/components/ui/skeleton-demo4"
import {
  UseThemeDemo3,
} from "@/components/ui/use-theme-demo3"
import {
  MultiSelectDemo2,
} from "@/components/ui/multi-select-demo2"
import {
  InputWithButtonDemo2,
} from "@/components/ui/input-with-button-demo2"
import {
  CalendarDemo3,
} from "@/components/ui/calendar-demo3"
import {
  ReloadDataDemo2,
} from "@/components/ui/reload-data-demo2"
import {
  XDemo2,
} from "@/components/ui/x-demo2"
import {
  PlusDemo2,
} from "@/components/ui/plus-demo2"
import {
  FilterDemo2,
} from "@/components/ui/filter-demo2"
import {
  ColumnsDemo2,
} from "@/components/ui/columns-demo2"
import {
  MoreVerticalDemo2,
} from "@/components/ui/more-vertical-demo2"
import {
  CopyDemo2,
} from "@/components/ui/copy-demo2"
import {
  EditDemo2,
} from "@/components/ui/edit-demo2"
import {
  DeleteDemo2,
} from "@/components/ui/delete-demo2"
import {
  ChevronDownDemo2,
} from "@/components/ui/chevron-down-demo2"
import {
  BadgeDemo3,
} from "@/components/ui/badge-demo3"
import {
  CheckboxDemo3,
} from "@/components/ui/checkbox-demo3"
import {
  SliderDemo4,
} from "@/components/ui/slider-demo4"
import {
  SwitchDemo4,
} from "@/components/ui/switch-demo4"
import {
  ProgressDemo4,
} from "@/components/ui/progress-demo4"
import {
  SeparatorDemo5,
} from "@/components/ui/separator-demo5"
import {
  AvatarDemo3,
  AvatarFallbackDemo3,
  AvatarImageDemo3,
} from "@/components/ui/avatar-demo3"
import {
  ScrollAreaDemo4,
} from "@/components/ui/scroll-area-demo4"
import {
  AspectRatioDemo3,
} from "@/components/ui/aspect-ratio-demo3"
import {
  HoverCardDemo4,
  HoverCardContentDemo3,
  HoverCardTriggerDemo3,
} from "@/components/ui/hover-card-demo4"
import {
  SkeletonDemo5,
} from "@/components/ui/skeleton-demo5"
import {
  UseThemeDemo4,
} from "@/components/ui/use-theme-demo4"
import {
  MultiSelectDemo3,
} from "@/components/ui/multi-select-demo3"
import {
  InputWithButtonDemo3,
} from "@/components/ui/input-with-button-demo3"
import {
  CalendarDemo4,
} from "@/components/ui/calendar-demo4"
import {
  ReloadDataDemo3,
} from "@/components/ui/reload-data-demo3"
import {
  XDemo3,
} from "@/components/ui/x-demo3"
import {
  PlusDemo3,
} from "@/components/ui/plus-demo3"
import {
  FilterDemo3,
} from "@/components/ui/filter-demo3"
import {
  ColumnsDemo3,
} from "@/components/ui/columns-demo3"
import {
  MoreVerticalDemo3,
} from "@/components/ui/more-vertical-demo3"
import {
  CopyDemo3,
} from "@/components/ui/copy-demo3"
import {
  EditDemo3,
} from "@/components/ui/edit-demo3"
import {
  DeleteDemo3,
} from "@/components/ui/delete-demo3"
import {
  ChevronDownDemo3,
} from "@/components/ui/chevron-down-demo3"
import {
  BadgeDemo4,
} from "@/components/ui/badge-demo4"
import {
  CheckboxDemo4,
} from "@/components/ui/checkbox-demo4"
import {
  SliderDemo5,
} from "@/components/ui/slider-demo5"
import {
  SwitchDemo5,
} from "@/components/ui/switch-demo5"
import {
  ProgressDemo5,
} from "@/components/ui/progress-demo5"
import {
  SeparatorDemo6,
} from "@/components/ui/separator-demo6"
import {
  AvatarDemo4,
  AvatarFallbackDemo4,
  AvatarImageDemo4,
} from "@/components/ui/avatar-demo4"
import {
  ScrollAreaDemo5,
} from "@/components/ui/scroll-area-demo5"
import {
  AspectRatioDemo4,
} from "@/components/ui/aspect-ratio-demo4"
import {
  HoverCardDemo5,
  HoverCardContentDemo4,
  HoverCardTriggerDemo4,
} from "@/components/ui/hover-card-demo5"
import {
  SkeletonDemo6,
} from "@/components/ui/skeleton-demo6"
import {
  UseThemeDemo5,
} from "@/components/ui/use-theme-demo5"
import {
  MultiSelectDemo4,
} from "@/components/ui/multi-select-demo4"
import {
  InputWithButtonDemo4,
} from "@/components/ui/input-with-button-demo4"
import {
  CalendarDemo5,
} from "@/components/ui/calendar-demo5"
import {
  ReloadDataDemo4,
} from "@/components/ui/reload-data-demo4"
import {
  XDemo4,
} from "@/components/ui/x-demo4"
import {
  PlusDemo4,
} from "@/components/ui/plus-demo4"
import {
  FilterDemo4,
} from "@/components/ui/filter-demo4"
import {
  ColumnsDemo4,
} from "@/components/ui/columns-demo4"
import {
  MoreVerticalDemo4,
} from "@/components/ui/more-vertical-demo4"
import {
  CopyDemo4,
} from "@/components/ui/copy-demo4"
import {
  EditDemo4,
} from "@/components/ui/edit-demo4"
import {
  DeleteDemo4,
} from "@/components/ui/delete-demo4"
import {
  ChevronDownDemo4,
} from "@/components/ui/chevron-down-demo4"
import {
  BadgeDemo5,
} from "@/components/ui/badge-demo5"
import {
  CheckboxDemo5,
} from "@/components/ui/checkbox-demo5"
import {
  SliderDemo6,
} from "@/components/ui/slider-demo6"
import {
  SwitchDemo6,
} from "@/components/ui/switch-demo6"
import {
  ProgressDemo6,
} from "@/components/ui/progress-demo6"
import {
  SeparatorDemo7,
} from "@/components/ui/separator-demo7"
import {
  AvatarDemo5,
  AvatarFallbackDemo5,
  AvatarImageDemo5,
} from "@/components/ui/avatar-demo5"
import {
  ScrollAreaDemo6,
} from "@/components/ui/scroll-area-demo6"
import {
  AspectRatioDemo5,
} from "@/components/ui/aspect-ratio-demo5"
import {
  HoverCardDemo6,
  HoverCardContentDemo5,
  HoverCardTriggerDemo5,
} from "@/components/ui/hover-card-demo6"
import {
  SkeletonDemo7,
} from "@/components/ui/skeleton-demo7"
import {
  UseThemeDemo6,
} from "@/components/ui/use-theme-demo6"
import {
  MultiSelectDemo5,
} from "@/components/ui/multi-select-demo5"
import {
  InputWithButtonDemo5,
} from "@/components/ui/input-with-button-demo5"
import {
  CalendarDemo6,
} from "@/components/ui/calendar-demo6"
import {
  ReloadDataDemo5,
} from "@/components/ui/reload-data-demo5"
import {
  XDemo5,
} from "@/components/ui/x-demo5"
import {
  PlusDemo5,
} from "@/components/ui/plus-demo5"
import {
  FilterDemo5,
} from "@/components/ui/filter-demo5"
import {
  ColumnsDemo5,
} from "@/components/ui/columns-demo5"
import {
  MoreVerticalDemo5,
} from "@/components/ui/more-vertical-demo5"
import {
  CopyDemo5,
} from "@/components/ui/copy-demo5"
import {
  EditDemo5,
} from "@/components/ui/edit-demo5"
import {
  DeleteDemo5,
} from "@/components/ui/delete-demo5"
import {
  ChevronDownDemo5,
} from "@/components/ui/chevron-down-demo5"
import {
  BadgeDemo6,
} from "@/components/ui/badge-demo6"
import {
  CheckboxDemo6,
} from "@/components/ui/checkbox-demo6"
import {
  SliderDemo7,
} from "@/components/ui/slider-demo7"
import {
  SwitchDemo7,
} from "@/components/ui/switch-demo7"
import {
  ProgressDemo7,
} from "@/components/ui/progress-demo7"
import {
  SeparatorDemo8,
} from "@/components/ui/separator-demo8"
import {
  AvatarDemo6,
  AvatarFallbackDemo6,
  AvatarImageDemo6,
} from "@/components/ui/avatar-demo6"
import {
  ScrollAreaDemo7,
} from "@/components/ui/scroll-area-demo7"
import {
  AspectRatioDemo6,
} from "@/components/ui/aspect-ratio-demo6"
import {
  HoverCardDemo7,
  HoverCardContentDemo6,
  HoverCardTriggerDemo6,
} from "@/components/ui/hover-card-demo7"
import {
  SkeletonDemo8,
} from "@/components/ui/skeleton-demo8"
import {
  UseThemeDemo7,
} from "@/components/ui/use-theme-demo7"
import {
  MultiSelectDemo6,
} from "@/components/ui/multi-select-demo6"
import {
  InputWithButtonDemo6,
} from "@/components/ui/input-with-button-demo6"
import {
  CalendarDemo7,
} from "@/components/ui/calendar-demo7"
import {
  ReloadDataDemo6,
} from "@/components/ui/reload-data-demo6"
import {
  XDemo6,
} from "@/components/ui/x-demo6"
import {
  PlusDemo6,
} from "@/components/ui/plus-demo6"
import {
  FilterDemo6,
} from "@/components/ui/filter-demo6"
import {
  ColumnsDemo6,
} from "@/components/ui/columns-demo6"
import {
  MoreVerticalDemo6,
} from "@/components/ui/more-vertical-demo6"
import {
  CopyDemo6,
} from "@/components/ui/copy-demo6"
import {
  EditDemo6,
} from "@/components/ui/edit-demo6"
import {
  DeleteDemo6,
} from "@/components/ui/delete-demo6"
import {
  ChevronDownDemo6,
} from "@/components/ui/chevron-down-demo6"
import {
  BadgeDemo7,
} from "@/components/ui/badge-demo7"
import {
  CheckboxDemo7,
} from "@/components/ui/checkbox-demo7"
import {
  SliderDemo8,
} from "@/components/ui/slider-demo8"
import {
  SwitchDemo8,
} from "@/components/ui/switch-demo8"
import {
  ProgressDemo8,
} from "@/components/ui/progress-demo8"
import {
  SeparatorDemo9,
} from "@/components/ui/separator-demo9"
import {
  AvatarDemo7,
  AvatarFallbackDemo7,
  AvatarImageDemo7,
} from "@/components/ui/avatar-demo7"
import {
  ScrollAreaDemo8,
} from "@/components/ui/scroll-area-demo8"
import {
  AspectRatioDemo7,
} from "@/components/ui/aspect-ratio-demo7"
import {
  HoverCardDemo8,
  HoverCardContentDemo7,
  HoverCardTriggerDemo7,
} from "@/components/ui/hover-card-demo8"
import {
  SkeletonDemo9,
} from "@/components/ui/skeleton-demo9"
import {
  UseThemeDemo8,
} from "@/components/ui/use-theme-demo8"
import {
  MultiSelectDemo7,
} from "@/components/ui/multi-select-demo7"
import {
  InputWithButtonDemo
