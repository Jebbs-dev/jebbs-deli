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
import { User } from "@/types/types";
import { useLoginUser } from "../../mutations/login";
import { useToast } from "@/hooks/use-toast";
import { useCreateUser } from "../../mutations/register";
import { useAuthFormModal } from "@/store/auth-form-modal";
import { useRouter } from "next/navigation";

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
  const { mutateAsync: loginUser } = useLoginUser();
  const { mutateAsync: registerUser } = useCreateUser();
  const { toast } = useToast();
  const { onAuthFormClose } = useAuthFormModal();
  const router =  useRouter();

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
    password: z
      .string()
      .min(4, {
        message: "Password must be at least 4 characters long.",
      })
      .max(10, {
        message: "Password must be no more than 10 characters long.",
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

  const login = async (values: { email: string; password: string }) => {
    try {
      await loginUser(values);
      toast({
        title: "Success",
        description: "Logged in successfully!",
      });
      // window.location.reload()
      // router.push("/shop")
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
      toast({
        title: "Success",
        description: "User created successfully!",
      });
      router.push("/auth")
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
          className="space-y-4 text-left"
        >
          {variant === "register" && (
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Jack Smith" {...field} className="" />
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
                    className=""
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
                    className=""
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
            onClick={() => {
              onAuthFormClose();
            }}
          >
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AuthForm;
