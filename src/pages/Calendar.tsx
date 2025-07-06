import { useState } from "react";
import {
  Calendar as CalendarIcon,
  Plus,
  Download,
  Settings,
  Bell,
  Clock,
  MapPin,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import CompetitionCard from "@/components/CompetitionCard";
import { mockCompetitions } from "@/lib/mockData";
import { Competition } from "@/types";

export default function Calendar() {
  const [selectedView, setSelectedView] = useState<"month" | "week" | "list">(
    "month",
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Get competitions for current month
  const thisMonthCompetitions = mockCompetitions.filter((comp) => {
    const startDate = new Date(comp.startDate);
    const regDate = new Date(comp.registrationDeadline);
    return (
      (startDate.getMonth() === currentMonth &&
        startDate.getFullYear() === currentYear) ||
      (regDate.getMonth() === currentMonth &&
        regDate.getFullYear() === currentYear)
    );
  });

  const upcomingDeadlines = mockCompetitions
    .filter((comp) => {
      const deadline = new Date(comp.registrationDeadline);
      const today = new Date();
      const diffTime = deadline.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 && diffDays <= 7;
    })
    .sort(
      (a, b) =>
        new Date(a.registrationDeadline).getTime() -
        new Date(b.registrationDeadline).getTime(),
    );

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("vi-VN", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(date));
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  const getDaysUntilDeadline = (deadline: Date) => {
    const today = new Date();
    const diffTime = new Date(deadline).getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Mock calendar grid for current month
  const generateCalendarDays = () => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const startDate = new Date(firstDayOfMonth);
    startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay());

    const days = [];
    const endDate = new Date(lastDayOfMonth);
    endDate.setDate(endDate.getDate() + (6 - lastDayOfMonth.getDay()));

    for (
      let date = new Date(startDate);
      date <= endDate;
      date.setDate(date.getDate() + 1)
    ) {
      const dayCompetitions = mockCompetitions.filter((comp) => {
        const startDate = new Date(comp.startDate);
        const regDate = new Date(comp.registrationDeadline);
        const currentDay = new Date(date);
        return (
          startDate.toDateString() === currentDay.toDateString() ||
          regDate.toDateString() === currentDay.toDateString()
        );
      });

      days.push({
        date: new Date(date),
        isCurrentMonth: date.getMonth() === currentMonth,
        competitions: dayCompetitions,
      });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();
  const weekDays = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Lịch cuộc thi</h1>
            <p className="text-muted-foreground">
              Quản lý và theo dõi các cuộc thi quan trọng
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Xuất lịch
            </Button>
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Cài đặt thông báo
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Thêm vào lịch
            </Button>
          </div>
        </div>

        {/* Quick Actions & Upcoming Deadlines */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-warning" />
                  Deadline sắp tới
                </CardTitle>
                <Badge variant="secondary">
                  {upcomingDeadlines.length} cuộc thi
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {upcomingDeadlines.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  Không có deadline nào trong 7 ngày tới
                </p>
              ) : (
                <div className="space-y-3">
                  {upcomingDeadlines.map((competition) => {
                    const daysLeft = getDaysUntilDeadline(
                      competition.registrationDeadline,
                    );
                    return (
                      <div
                        key={competition.id}
                        className="flex items-center justify-between p-3 rounded-lg border"
                      >
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1">
                            {competition.title}
                          </h4>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatDate(competition.registrationDeadline)}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {competition.location}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge
                            variant={
                              daysLeft <= 2
                                ? "destructive"
                                : daysLeft <= 5
                                  ? "default"
                                  : "secondary"
                            }
                            className="mb-2"
                          >
                            {daysLeft === 1
                              ? "Còn 1 ngày"
                              : `Còn ${daysLeft} ngày`}
                          </Badge>
                          <div className="text-xs text-muted-foreground">
                            Hạn đăng ký
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cài đặt nhắc nhở</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox id="email" defaultChecked />
                  <Label htmlFor="email">Email thông báo</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="push" defaultChecked />
                  <Label htmlFor="push">Push notification</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="calendar" />
                  <Label htmlFor="calendar">Đồng bộ Google Calendar</Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Thời gian nhắc trước:</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="week" defaultChecked />
                    <Label htmlFor="week" className="text-sm">
                      1 tuần trước
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="3days" defaultChecked />
                    <Label htmlFor="3days" className="text-sm">
                      3 ngày trước
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="1day" defaultChecked />
                    <Label htmlFor="1day" className="text-sm">
                      1 ngày trước
                    </Label>
                  </div>
                </div>
              </div>

              <Button className="w-full" size="sm">
                Lưu cài đặt
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Calendar Views */}
        <Tabs
          value={selectedView}
          onValueChange={(value) => setSelectedView(value as any)}
        >
          <div className="flex items-center justify-between mb-6">
            <TabsList>
              <TabsTrigger value="month">Tháng</TabsTrigger>
              <TabsTrigger value="week">Tuần</TabsTrigger>
              <TabsTrigger value="list">Danh sách</TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-3">
              <Select>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Lọc theo lĩnh vực" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="programming">Lập trình</SelectItem>
                  <SelectItem value="design">Thiết kế</SelectItem>
                  <SelectItem value="business">Kinh doanh</SelectItem>
                  <SelectItem value="science">Khoa học</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <TabsContent value="month">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>
                    Tháng {currentMonth + 1}, {currentYear}
                  </span>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-blue-500 rounded"></div>
                      <span>Bắt đầu thi</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-orange-500 rounded"></div>
                      <span>Hạn đăng ký</span>
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {weekDays.map((day) => (
                    <div
                      key={day}
                      className="p-2 text-center font-semibold text-sm text-muted-foreground"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {calendarDays.map((day, index) => (
                    <div
                      key={index}
                      className={`min-h-[100px] p-2 border rounded-lg ${
                        day.isCurrentMonth ? "bg-background" : "bg-muted/30"
                      } ${
                        day.date.toDateString() === currentDate.toDateString()
                          ? "ring-2 ring-primary"
                          : ""
                      }`}
                    >
                      <div
                        className={`text-sm font-medium mb-1 ${
                          day.isCurrentMonth
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        {day.date.getDate()}
                      </div>

                      <div className="space-y-1">
                        {day.competitions.slice(0, 2).map((comp) => {
                          const isDeadline =
                            new Date(
                              comp.registrationDeadline,
                            ).toDateString() === day.date.toDateString();
                          const isStart =
                            new Date(comp.startDate).toDateString() ===
                            day.date.toDateString();

                          return (
                            <div
                              key={comp.id}
                              className={`text-xs p-1 rounded truncate ${
                                isDeadline
                                  ? "bg-orange-100 text-orange-700"
                                  : "bg-blue-100 text-blue-700"
                              }`}
                              title={comp.title}
                            >
                              {comp.title}
                            </div>
                          );
                        })}
                        {day.competitions.length > 2 && (
                          <div className="text-xs text-muted-foreground">
                            +{day.competitions.length - 2} khác
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="week">
            <Card>
              <CardHeader>
                <CardTitle>Tuần này</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-8">
                  Chế độ xem tuần đang được phát triển
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="list">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Cuộc thi tháng này</CardTitle>
                </CardHeader>
                <CardContent>
                  {thisMonthCompetitions.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      Không có cuộc thi nào trong tháng này
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {thisMonthCompetitions.map((competition) => (
                        <CompetitionCard
                          key={competition.id}
                          competition={competition}
                          variant="compact"
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
