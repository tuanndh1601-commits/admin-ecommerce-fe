"use client"

import {
  Frame,
  GalleryVerticalEnd,
  LayoutDashboard,
  Map,
  PieChart,
  ShoppingBag,
  Store,
  Truck,
} from "lucide-react"
import * as React from "react"

import { NavMain } from "@/components/sidebar/nav-main"
import { NavProjects } from "@/components/sidebar/nav-projects"
import { NavUser } from "@/components/sidebar/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "TuanNDH",
    email: "tuanndh@ascvn.com.vn",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Tổng quan kinh doanh", // Thay cho Playground
      url: "#",
      icon: LayoutDashboard, // Đổi icon cho hợp với Ecommerce
      isActive: true,
      items: [
        {
          title: "Báo cáo doanh thu",
          url: "#",
        },
        {
          title: "Hiệu suất bán hàng",
          url: "#",
        },
        {
          title: "Xu hướng thị trường",
          url: "#",
        },
      ],
    },
    {
      title: "Quản lý sản phẩm", // Thay cho Models
      url: "#",
      icon: ShoppingBag,
      items: [
        {
          title: "Danh sách sản phẩm",
          url: "#",
        },
        {
          title: "Danh mục & Thương hiệu",
          url: "#",
        },
        {
          title: "Quản lý kho hàng",
          url: "#",
        },
      ],
    },
    {
      title: "Đơn hàng & Vận chuyển", // Thay cho Documentation
      url: "#",
      icon: Truck,
      items: [
        {
          title: "Đơn hàng mới",
          url: "#",
        },
        {
          title: "Xử lý & Hoàn đơn",
          url: "#",
        },
        {
          title: "Đối soát vận chuyển",
          url: "#",
        },
        {
          title: "Khiếu nại / Hoàn tiền",
          url: "#",
        },
      ],
    },
    {
      title: "Cấu hình cửa hàng", // Thay cho Settings chung chung
      url: "#",
      icon: Store,
      items: [
        {
          title: "Thông tin shop",
          url: "#",
        },
        {
          title: "Phân quyền nhân viên",
          url: "#",
        },
        {
          title: "Cổng thanh toán",
          url: "#",
        },
        {
          title: "Cài đặt phí ship",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">BNxREI</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
