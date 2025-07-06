import { useParams } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Users,
  Trophy,
  Clock,
  ExternalLink,
  Share,
  Heart,
  Bookmark,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { mockCompetitions, mockUsers } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export default function Competition() {
  const { id } = useParams();
  const competition = mockCompetitions.find((comp) => comp.id === id);

  if (!competition) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Không tìm thấy cuộc thi</h1>
        <p className="text-muted-foreground">
          Cuộc thi bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
        </p>
      </div>
    );
  }

  const getStatusBadge = () => {
    switch (competition.status) {
      case "registration-open":
        return (
          <Badge className="bg-green-100 text-green-700 border-green-200">
            Đang mở đăng ký
          </Badge>
        );
      case "upcoming":
        return <Badge variant="secondary">Sắp diễn ra</Badge>;
      case "ongoing":
        return (
          <Badge className="bg-blue-100 text-blue-700 border-blue-200">
            Đang diễn ra
          </Badge>
        );
      case "completed":
        return <Badge variant="outline">Đã k��t thúc</Badge>;
      default:
        return null;
    }
  };

  const getCategoryIcon = () => {
    const iconMap: Record<string, string> = {
      programming: "💻",
      design: "🎨",
      business: "💼",
      science: "🔬",
      mathematics: "📐",
      innovation: "💡",
      startup: "🚀",
      creative: "✨",
    };
    return iconMap[competition.category] || "🏆";
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("vi-VN", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  const formatDateShort = (date: Date) => {
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(date));
  };

  const getDaysUntilDeadline = () => {
    const today = new Date();
    const deadline = new Date(competition.registrationDeadline);
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getRegistrationProgress = () => {
    if (!competition.maxParticipants) return 0;
    return (competition.participants / competition.maxParticipants) * 100;
  };

  const daysLeft = getDaysUntilDeadline();
  const registrationProgress = getRegistrationProgress();

  // Mock similar competitions
  const similarCompetitions = mockCompetitions
    .filter(
      (comp) =>
        comp.id !== competition.id && comp.category === competition.category,
    )
    .slice(0, 3);

  // Mock participants
  const participants = mockUsers.slice(0, 8);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative">
        {competition.imageUrl && (
          <div className="h-64 bg-gradient-to-r from-primary/90 to-purple-600/90 flex items-end">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${competition.imageUrl})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
          </div>
        )}

        <div className="container relative -mt-16 pb-8">
          <Card className="shadow-strong">
            <CardContent className="pt-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Main Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{getCategoryIcon()}</div>
                      <div>
                        <Badge variant="secondary" className="mb-2">
                          {competition.category}
                        </Badge>
                        <h1 className="text-2xl lg:text-3xl font-bold">
                          {competition.title}
                        </h1>
                      </div>
                    </div>
                    {getStatusBadge()}
                  </div>

                  <p className="text-muted-foreground mb-6 text-lg">
                    {competition.description}
                  </p>

                  {/* Key Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">Hạn đăng ký</div>
                        <div className="text-sm text-muted-foreground">
                          {formatDateShort(competition.registrationDeadline)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">Địa điểm</div>
                        <div className="text-sm text-muted-foreground">
                          {competition.location}{" "}
                          {competition.isOnline && "(Online)"}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">Người tham gia</div>
                        <div className="text-sm text-muted-foreground">
                          {competition.participants} người
                          {competition.maxParticipants &&
                            ` / ${competition.maxParticipants}`}
                        </div>
                      </div>
                    </div>

                    {competition.prizePool && (
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                          <Trophy className="h-5 w-5 text-yellow-600" />
                        </div>
                        <div>
                          <div className="font-medium">Giải thưởng</div>
                          <div className="text-sm text-muted-foreground">
                            {competition.prizePool}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {competition.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Action Panel */}
                <div className="lg:w-80">
                  <Card>
                    <CardContent className="pt-6">
                      {/* Countdown */}
                      {daysLeft > 0 && (
                        <div className="text-center mb-6">
                          <div className="text-3xl font-bold text-primary mb-1">
                            {daysLeft}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            ngày còn lại để đăng ký
                          </div>
                        </div>
                      )}

                      {daysLeft < 0 && (
                        <div className="flex items-center gap-2 mb-6 p-3 bg-red-50 rounded-lg">
                          <AlertTriangle className="h-5 w-5 text-red-600" />
                          <span className="text-sm text-red-700">
                            Đã hết hạn đăng ký
                          </span>
                        </div>
                      )}

                      {/* Registration Progress */}
                      {competition.maxParticipants && (
                        <div className="mb-6">
                          <div className="flex justify-between text-sm mb-2">
                            <span>Đã đăng ký</span>
                            <span>
                              {competition.participants}/
                              {competition.maxParticipants}
                            </span>
                          </div>
                          <Progress
                            value={registrationProgress}
                            className="h-2"
                          />
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="space-y-3">
                        {competition.status === "registration-open" &&
                        daysLeft > 0 ? (
                          <Button className="w-full" size="lg">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Đăng ký tham gia
                          </Button>
                        ) : (
                          <Button
                            className="w-full"
                            variant="outline"
                            size="lg"
                            disabled
                          >
                            {competition.status === "completed"
                              ? "Đã kết thúc"
                              : "Chưa mở đăng ký"}
                          </Button>
                        )}

                        <div className="grid grid-cols-3 gap-2">
                          <Button variant="outline" size="sm">
                            <Heart className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Bookmark className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Share className="h-4 w-4" />
                          </Button>
                        </div>

                        {competition.website && (
                          <Button variant="outline" className="w-full" asChild>
                            <a
                              href={competition.website}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Website chính thức
                            </a>
                          </Button>
                        )}
                      </div>

                      <Separator className="my-6" />

                      {/* Organizer */}
                      <div>
                        <div className="font-medium mb-2">Ban tổ chức</div>
                        <div className="text-sm text-muted-foreground">
                          {competition.organizer}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Content Tabs */}
      <section className="container pb-16">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
            <TabsTrigger value="timeline">Lịch trình</TabsTrigger>
            <TabsTrigger value="participants">Thí sinh</TabsTrigger>
            <TabsTrigger value="similar">Tương tự</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Mô tả chi tiết</CardTitle>
                  </CardHeader>
                  <CardContent className="prose prose-sm max-w-none">
                    <p>{competition.description}</p>
                    <p>
                      Đây là cơ hội tuyệt vời để thể hiện kỹ năng và học hỏi từ
                      các chuyên gia hàng đầu trong lĩnh vực. Cuộc thi không chỉ
                      mang lại những giải thưởng hấp dẫn mà còn giúp bạn mở rộng
                      mạng lưới và phát triển sự nghiệp.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Kỹ năng yêu cầu</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {competition.requiredSkills.map((skill) => (
                        <Badge
                          key={skill.name}
                          variant="secondary"
                          className="px-3 py-1"
                        >
                          {skill.name}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {competition.rules && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Thể lệ</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-sm max-w-none">
                        <p>
                          Thông tin chi tiết về thể lệ cuộc thi sẽ được cập nhật
                          sớm.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Thông tin quan trọng</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="text-sm font-medium mb-1">Cấp độ</div>
                      <Badge
                        variant={
                          competition.level === "expert"
                            ? "destructive"
                            : "outline"
                        }
                      >
                        {competition.level}
                      </Badge>
                    </div>

                    <div>
                      <div className="text-sm font-medium mb-1">
                        Thời gian diễn ra
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatDateShort(competition.startDate)} -{" "}
                        {formatDateShort(competition.endDate)}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium mb-1">Hình thức</div>
                      <div className="text-sm text-muted-foreground">
                        {competition.isOnline ? "Trực tuyến" : "Tại địa điểm"}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Lịch trình cuộc thi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-4 h-4 bg-primary rounded-full mt-1"></div>
                    <div>
                      <div className="font-medium">Mở đăng ký</div>
                      <div className="text-sm text-muted-foreground">
                        Từ ngày {formatDateShort(new Date())}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-4 h-4 bg-orange-500 rounded-full mt-1"></div>
                    <div>
                      <div className="font-medium">Hạn đăng ký</div>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(competition.registrationDeadline)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-4 h-4 bg-blue-500 rounded-full mt-1"></div>
                    <div>
                      <div className="font-medium">Bắt đầu cuộc thi</div>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(competition.startDate)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-4 h-4 bg-green-500 rounded-full mt-1"></div>
                    <div>
                      <div className="font-medium">
                        Kết thúc và công bố kết quả
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(competition.endDate)}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="participants" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Thí sinh đã đăng ký
                  <Badge variant="secondary">
                    {competition.participants} người
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {participants.map((participant) => (
                    <Card key={participant.id} className="text-center p-4">
                      <Avatar className="h-12 w-12 mx-auto mb-3">
                        <AvatarImage
                          src={participant.avatar}
                          alt={participant.fullName}
                        />
                        <AvatarFallback>
                          {participant.fullName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="font-medium text-sm mb-1">
                        {participant.fullName}
                      </div>
                      <div className="text-xs text-muted-foreground mb-2">
                        {participant.school}
                      </div>
                      <div className="flex justify-center">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Clock
                              key={i}
                              className={cn(
                                "h-3 w-3",
                                i < Math.floor(participant.rating)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300",
                              )}
                            />
                          ))}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="similar" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Cuộc thi tương tự</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {similarCompetitions.map((comp) => (
                    <Card key={comp.id} className="card-hover">
                      <CardContent className="pt-4">
                        <div className="flex items-start gap-3">
                          <div className="text-2xl">{getCategoryIcon()}</div>
                          <div className="flex-1">
                            <h3 className="font-semibold mb-1 line-clamp-2">
                              {comp.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                              {comp.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <Badge variant="outline" className="text-xs">
                                {comp.participants} người
                              </Badge>
                              <Button size="sm" variant="outline" asChild>
                                <a href={`/competition/${comp.id}`}>Xem</a>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
