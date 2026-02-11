import java.util.*;
import java.util.concurrent.*;

/**
 * STUDENT TASK:
 * Implement the logic inside FeatureStumpTask.call()
 * Each feature must act as a binary decision stump (depth-1 tree)
 */
public class RFFeatureStump {

    /* ==========================
       FEATURE STUMP TASK
       ========================== */
    static class FeatureStumpTask implements Callable<Integer> {

        private final double[][] X;   // training features
        private final int[] y;        // class labels (0 or 1)
        private final int featureIdx; // index of feature handled by this task
        private final double testVal; // test sample value for this feature

        FeatureStumpTask(double[][] X, int[] y,
                          int featureIdx, double testVal) {
            this.X = X;
            this.y = y;
            this.featureIdx = featureIdx;
            this.testVal = testVal;
        }

        @Override
        public Integer call() {
            // Implement your code here.
            return 0;
        }
    }

    /* ==========================
       MAIN METHOD (DO NOT MODIFY)
       ========================== */
    public static void main(String[] args) throws Exception {

        Scanner sc = new Scanner(System.in);

        // Read number of samples and features
        int N = sc.nextInt();
        int M = sc.nextInt();

        // Read training data
        double[][] X = new double[N][M];
        for (int i = 0; i < N; i++) {
            for (int j = 0; j < M; j++) {
                X[i][j] = sc.nextDouble();
            }
        }

        // Read class labels
        int[] y = new int[N];
        for (int i = 0; i < N; i++) {
            y[i] = sc.nextInt();
        }

        // Read test sample
        double[] testSample = new double[M];
        for (int i = 0; i < M; i++) {
            testSample[i] = sc.nextDouble();
        }

        // One thread per feature
        ExecutorService executor = Executors.newFixedThreadPool(M);
        List<Future<Integer>> futures = new ArrayList<>();

        for (int f = 0; f < M; f++) {
            futures.add(
                executor.submit(
                    new FeatureStumpTask(X, y, f, testSample[f])
                )
            );
        }

        // Collect feature predictions
        List<Integer> featurePredictions = new ArrayList<>();
        for (Future<Integer> f : futures) {
            featurePredictions.add(f.get());
        }

        executor.shutdown();

        // Majority voting
        int count0 = 0, count1 = 0;
        for (int p : featurePredictions) {
            if (p == 0) count0++;
            else count1++;
        }

        int finalPrediction = (count1 > count0) ? 1 : 0;

        // Output
        System.out.println("Feature Predictions: " + featurePredictions);
        System.out.println("Final Predicted Class: " + finalPrediction);

        sc.close();
    }
}
