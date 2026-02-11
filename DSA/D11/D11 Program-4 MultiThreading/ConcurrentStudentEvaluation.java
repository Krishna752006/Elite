import java.util.*;
import java.util.concurrent.*;

class EvaluationTask implements Callable<Integer> {

    private final int[] marks;
    private final String studentName;

    public EvaluationTask(String studentName, int[] marks) {
        // IMPLEMENT YOUR CODE
        this.studentName = studentName;
        this.marks = marks;
    }

    @Override
    public Integer call() throws Exception {
        // IMPLEMENT YOUR CODE
        int s = 0;
        for(int i: marks){
            if(i<0 || i>100) throw new Exception("Invalid marks detected");
            s+=i;
        }
        return s;
    }

    public String getStudentName() {
        // IMPLEMENT YOUR CODE
        return studentName;
    }
}

public class ConcurrentStudentEvaluation {

    private static final Object PRINT_LOCK = new Object();

    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);
        int N = sc.nextInt();

        ExecutorService executor = Executors.newFixedThreadPool(
                Math.min(N, Runtime.getRuntime().availableProcessors())
        );

        List<EvaluationTask> tasks = new ArrayList<>();
        List<Future<Integer>> futures = new ArrayList<>();

        // Read input and create tasks
        for (int i = 1; i <= N; i++) {
            int[] marks = new int[5];
            for (int j = 0; j < 5; j++) {
                marks[j] = sc.nextInt();
            }
            tasks.add(new EvaluationTask("Student-" + i, marks));
        }

        // Submit tasks
        for (EvaluationTask task : tasks) {
            futures.add(executor.submit(task));
        }

        // Retrieve results independently
        for (int i = 0; i < futures.size(); i++) {

            try {
                int result = futures.get(i).get();
                synchronized (PRINT_LOCK) {
                    System.out.println( tasks.get(i).getStudentName() + " Total = " + result );
                }

            } catch (ExecutionException e) {
                synchronized (PRINT_LOCK) {
                    System.out.println( "Evaluation failed for "
                        + tasks.get(i).getStudentName() + ": " + e.getCause().getMessage() );
                }

            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }

        executor.shutdown();
        sc.close();
    }
}
