import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  TrendingUp,
  Users,
  Calendar,
  Trophy,
  ArrowRight,
  Star,
  Zap,
  Target,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CompetitionCard from "@/components/CompetitionCard";
import SearchFilters from "@/components/SearchFilters";
import { mockCompetitions, competitionCategories } from "@/lib/mockData";
import { SearchFilters as SearchFiltersType, Competition } from "@/types";

export default function Index() {
  const [filters, setFilters] = useState<SearchFiltersType>({});
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCompetitions = useMemo(() => {
    let filtered = mockCompetitions;

    // Search by query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (comp) =>
          comp.title.toLowerCase().includes(query) ||
          comp.description.toLowerCase().includes(query) ||
          comp.organizer.toLowerCase().includes(query) ||
          comp.tags.some((tag) => tag.toLowerCase().includes(query)),
      );
    }

    // Apply filters
    if (filters.category?.length) {
      filtered = filtered.filter((comp) =>
        filters.category!.includes(comp.category),
      );
    }

    if (filters.level?.length) {
      filtered = filtered.filter((comp) => filters.level!.includes(comp.level));
    }

    if (filters.status?.length) {
      filtered = filtered.filter((comp) =>
        filters.status!.includes(comp.status),
      );
    }

    if (filters.isOnline !== undefined) {
      filtered = filtered.filter((comp) => comp.isOnline === filters.isOnline);
    }

    if (filters.prizePool) {
      filtered = filtered.filter((comp) => comp.prizePool);
    }

    if (filters.location) {
      const location = filters.location.toLowerCase();
      filtered = filtered.filter((comp) =>
        comp.location.toLowerCase().includes(location),
      );
    }

    return filtered;
  }, [filters, searchQuery, mockCompetitions]);

  const featuredCompetitions = mockCompetitions.filter((comp) => comp.featured);
  const upcomingCompetitions = mockCompetitions.filter(
    (comp) => comp.status === "registration-open",
  );
  const ongoingCompetitions = mockCompetitions.filter(
    (comp) => comp.status === "ongoing",
  );

  const stats = [
    {
      title: "Cuộc thi đang diễn ra",
      value: mockCompetitions.filter((c) => c.status === "ongoing").length,
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      title: "Thành viên hoạt động",
      value: "15.2K",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Cuộc thi tuần này",
      value: mockCompetitions.filter((c) => c.status === "registration-open")
        .length,
      icon: Calendar,
      color: "text-purple-600",
    },
    {
      title: "Tổng giải thưởng",
      value: "2.5B VNĐ",
      icon: Trophy,
      color: "text-yellow-600",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-competition-hero py-20">
        <div className="absolute inset-0 bg-grid-white/10 bg-grid-16" />
        <div className="container relative">
          <div className="mx-auto max-w-4xl text-center text-white">
            <Badge className="mb-4 bg-white/20 text-white border-white/30">
              🎉 Mới: Tích hợp lịch Google Calendar
            </Badge>
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl">
              Nền tảng cuộc thi <br />
              <span className="text-white/90">hàng đầu Việt Nam</span>
            </h1>
            <p className="mb-8 text-lg text-white/80 sm:text-xl max-w-2xl mx-auto">
              Khám phá, tham gia và kết nối với hàng nghìn cuộc thi chất lượng.
              Xây dựng portfolio cá nhân và tìm kiếm đối tác phù hợp với kỹ năng
              của bạn.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                size="lg"
                className="bg-white text-competition hover:bg-white/90"
              >
                <Search className="mr-2 h-5 w-5" />
                Khám phá cuộc thi
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                Tạo hồ sơ cá nhân
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-b">
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="text-center">
                  <CardContent className="pt-6">
                    <Icon className={`h-8 w-8 mx-auto mb-3 ${stat.color}`} />
                    <div className="text-2xl font-bold mb-1">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">
                      {stat.title}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container">
          <Tabs defaultValue="all" className="space-y-8">
            <div className="flex items-center justify-between">
              <TabsList className="grid w-fit grid-cols-4 lg:w-auto">
                <TabsTrigger value="all">Tất cả</TabsTrigger>
                <TabsTrigger value="featured">Nổi bật</TabsTrigger>
                <TabsTrigger value="registration">Đang mở</TabsTrigger>
                <TabsTrigger value="ongoing">Đang diễn ra</TabsTrigger>
              </TabsList>

              <div className="hidden lg:flex items-center space-x-2 text-sm text-muted-foreground">
                <span>Hiển thị {filteredCompetitions.length} cuộc thi</span>
              </div>
            </div>

            <TabsContent value="all" className="space-y-6">
              <SearchFilters
                filters={filters}
                onFiltersChange={setFilters}
                onSearch={setSearchQuery}
              />

              {filteredCompetitions.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-lg font-semibold mb-2">
                    Không tìm thấy kết quả
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Thử điều chỉnh bộ l��c hoặc từ khóa tìm kiếm
                  </p>
                  <Button
                    onClick={() => {
                      setFilters({});
                      setSearchQuery("");
                    }}
                  >
                    Xóa bộ lọc
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredCompetitions.map((competition) => (
                    <CompetitionCard
                      key={competition.id}
                      competition={competition}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="featured" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {featuredCompetitions.map((competition) => (
                  <CompetitionCard
                    key={competition.id}
                    competition={competition}
                    variant="featured"
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="registration" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {upcomingCompetitions.map((competition) => (
                  <CompetitionCard
                    key={competition.id}
                    competition={competition}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="ongoing" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {ongoingCompetitions.map((competition) => (
                  <CompetitionCard
                    key={competition.id}
                    competition={competition}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Khám phá theo lĩnh vực</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Tìm kiếm cuộc thi phù hợp với sở thích và kỹ năng của bạn
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {competitionCategories.map((category) => (
              <Card
                key={category.name}
                className="group cursor-pointer card-hover text-center p-4"
                onClick={() => setFilters({ category: [category.name as any] })}
              >
                <div className="text-3xl mb-2">{category.icon}</div>
                <div className="text-sm font-medium group-hover:text-primary transition-colors">
                  {category.label}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Tại sao chọn Contest Buddy?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Nền tảng toàn diện giúp bạn phát triển kỹ năng và xây dựng mạng
              lưới
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Gợi ý thông minh</h3>
              <p className="text-sm text-muted-foreground">
                Thuật toán AI gợi ý cuộc thi và đối tác phù hợp với kỹ năng,
                trường học và khu vực của bạn
              </p>
            </Card>

            <Card className="text-center p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Portfolio cá nhân</h3>
              <p className="text-sm text-muted-foreground">
                Xây dựng hồ sơ công khai với thành tích, kỹ năng và nhận đánh
                giá từ cộng đồng
              </p>
            </Card>

            <Card className="text-center p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Quản lý lịch thi</h3>
              <p className="text-sm text-muted-foreground">
                Tự động đồng bộ với Google Calendar và nhận thông báo deadline
                theo cài đặt cá nhân
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-competition-hero">
        <div className="container">
          <div className="text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              Sẵn sàng bắt đầu hành trình thi đấu?
            </h2>
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
              Tham gia cộng đồng hơn 15,000 thành viên và khám phá cơ hội phát
              triển bản thân
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                size="lg"
                className="bg-white text-competition hover:bg-white/90"
              >
                Đăng ký miễn phí
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                Tìm hiểu thêm
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
