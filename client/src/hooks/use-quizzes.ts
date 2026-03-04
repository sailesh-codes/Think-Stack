import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, errorSchemas } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

// Generate Quiz Input Type
type GenerateQuizInput = z.infer<typeof api.quizzes.generate.input>;
type Quiz = z.infer<typeof api.quizzes.get.responses[200]>;

export function useQuizzes() {
  const { toast } = useToast();

  return useQuery({
    queryKey: [api.quizzes.list.path],
    queryFn: async () => {
      const res = await fetch(api.quizzes.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch quizzes");
      return api.quizzes.list.responses[200].parse(await res.json());
    },
  });
}

export function useQuiz(id: string) {
  return useQuery({
    queryKey: [api.quizzes.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.quizzes.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      
      if (res.status === 401) {
        // User is not authenticated, redirect to login
        window.location.href = "/login";
        throw new Error("Authentication required");
      }
      
      if (res.status === 404) return null;
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Quiz fetch error:', res.status, errorText);
        throw new Error(`Failed to fetch quiz (${res.status}): ${errorText}`);
      }
      
      return api.quizzes.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
    retry: false,
    staleTime: 1000 * 60,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}

export function useGenerateQuiz() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: GenerateQuizInput) => {
      console.log('Mutation function called with data:', data);
      
      // Add timeout to prevent infinite loading
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      try {
        const res = await fetch(api.quizzes.generate.path, {
          method: api.quizzes.generate.method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
          credentials: "include",
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        console.log('API response status:', res.status);

        if (!res.ok) {
          if (res.status === 402) {
            const error = errorSchemas.paymentRequired.parse(await res.json());
            throw new Error(error.message);
          }
          if (res.status === 400) {
            const error = errorSchemas.validation.parse(await res.json());
            throw new Error(error.message);
          }
          throw new Error(`Failed to generate quiz (${res.status})`);
        }

        const result = api.quizzes.generate.responses[201].parse(await res.json());
        console.log('Parsed result:', result);
        return result;
      } catch (error: any) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
          throw new Error('Quiz generation timed out. Please try again.');
        }
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log('Mutation onSuccess called with data:', data);
      // Just invalidate queries, let component handle success messages
      queryClient.invalidateQueries({ queryKey: [api.quizzes.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.auth.me.path] });
    },
    onError: (error) => {
      console.log('Mutation onError called with error:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
    // Add timeout to prevent infinite loading
    retry: false,
    retryDelay: 0,
  });
}

export function useDeleteQuiz() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const url = buildUrl(api.quizzes.delete.path, { id });
      const res = await fetch(url, {
        method: api.quizzes.delete.method,
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 404) throw new Error("Quiz not found");
        throw new Error("Failed to delete quiz");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.quizzes.list.path] });
      toast({
        title: "Deleted",
        description: "Quiz removed successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// User Usage / Credits Hook
export function useUserUsage() {
  return useQuery({
    queryKey: [api.auth.me.path],
    queryFn: async () => {
      const res = await fetch(api.auth.me.path, { credentials: "include" });
      if (res.status === 401) return null;
      if (!res.ok) throw new Error("Failed to fetch user data");
      return api.auth.me.responses[200].parse(await res.json());
    },
    retry: false,
  });
}

// Stripe Checkout Hook
export function useCreateCheckout() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      const res = await fetch(api.stripe.createCheckout.path, {
        method: api.stripe.createCheckout.method,
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create checkout session");
      return api.stripe.createCheckout.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      window.location.href = data.url;
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Could not start checkout process.",
        variant: "destructive",
      });
    },
  });
}
