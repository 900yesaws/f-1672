
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface AdminLoginModalProps {
  onLogin: (password: string) => void;
  error: string;
}

const AdminLoginModal = ({ onLogin, error }: AdminLoginModalProps) => {
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  
  const handleLogin = () => {
    onLogin(password);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="ml-auto">
          Admin Login
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Admin Login</DialogTitle>
          <DialogDescription>
            Enter the admin password to manage products.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Admin Password"
            className="w-full"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleLogin();
              }
            }}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleLogin}>Login</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AdminLoginModal;
