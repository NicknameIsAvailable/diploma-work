import { Card } from "../ui/card";

export const Footer = () => {
  const date = new Date();

  return (
    <footer>
      <Card className="rounded-none w-full mt-4 py-4">
        <div className="container mx-auto">
          @Колледж метростроя {date.getFullYear()}
        </div>
      </Card>
    </footer>
  );
};
