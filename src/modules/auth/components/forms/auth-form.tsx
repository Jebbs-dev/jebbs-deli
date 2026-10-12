import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLoginUser } from "../../mutations/login";
import { useToast } from "@/hooks/use-toast";
import { useCreateUser } from "../../mutations/register";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { FaSpinner } from "react-icons/fa6";

interface AuthFormProps {
  variant: string;
}

const signupDefaultValues = {
  name: "",
  email: "",
  password: "",
};

const loginDefaultValues = {
  email: "",
  password: "",
};

const AuthForm = ({ variant }: AuthFormProps) => {
  const { mutateAsync: loginUser, isPending: isLoginPending } = useLoginUser();
  const { mutateAsync: registerUser, isPending: isSignupPending } =
    useCreateUser();
  const { toast } = useToast();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const formSchema = z.object({
    name: z
      .string()
      .min(3, {
        message: "Name must be at least 3 characters long.",
      })
      .optional(),
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    password: z.string().min(6, {
      message: "Password must be at least 6 characters long.",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues:
      variant === "login" ? loginDefaultValues : signupDefaultValues,
  });

  // function onSubmit(values: z.infer<typeof formSchema>) {
  //   // Do something with the form values.
  //   // ✅ This will be type-safe and validated.
  //   console.log(values);
  // }

  const leaveAuthPage = () => {
    if (pathname.startsWith("/auth")) {
      navigate({ to: "/shop", replace: true });
    }
  };

  const login = async (values: { email: string; password: string }) => {
    try {
      await loginUser(values);
      toast({
        title: "Success",
        description: "Logged in successfully!",
      });
      leaveAuthPage();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong!",
      });
    }
  };

  const register = async (values: z.infer<typeof formSchema>) => {
    try {
      if (!values.name) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Name is required for registration.",
        });
        return;
      }

      await registerUser({
        name: values.name,
        email: values.email,
        password: values.password,
      });
      await loginUser({
        email: values.email,
        password: values.password,
      });
      toast({
        title: "Success",
        description: "Account created. You're signed in.",
      });
      leaveAuthPage();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong!",
      });
    }
  };

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={
            variant === "login"
              ? form.handleSubmit(login)
              : form.handleSubmit(register)
          }
          className="space-y-4 text-left text-ash"
        >
          {variant === "register" && (
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Jack Smith"
                      {...field}
                      className="border-black/10 bg-white text-ash placeholder:text-ash/50"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="user@example.com"
                    {...field}
                    className="border-black/10 bg-white text-ash placeholder:text-ash/50"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="password"
                    type="password"
                    {...field}
                    className="border-black/10 bg-white text-ash placeholder:text-ash/50"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="bg-primary w-full hover:bg-orange-600 disabled:bg-gray-400"
          >
            {isLoginPending || isSignupPending ? (
              <>
                Submitting
                <span className="ml-2 text-sm">
                  <FaSpinner className="animate-spin" />
                </span>
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AuthForm;
