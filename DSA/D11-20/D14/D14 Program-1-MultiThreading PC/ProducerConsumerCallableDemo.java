import java.util.*;
import java.util.concurrent.*;

class Order{
    int order_id;
    String customer_name;
    String product;
    int qty;
    double price;
    Order(int id,String n,String p,int q,double pr){
        order_id=id;
        customer_name=n;
        product=p;
        qty=q;
        price=pr;
    }
    
}
class OrderBuffer{
    int n;
    Queue<Order> arr;
    OrderBuffer(int d){
        n=d;
        arr=new LinkedList<>();
    }
    public synchronized void put(Order x)throws InterruptedException{
        if(arr.size()==n){
            wait();
        }else{
            arr.add(x);
            notify();
        }
    }
    public synchronized Order get()throws InterruptedException{
        if(arr.isEmpty()){
            wait();
        }
        Order b= arr.poll();
        notify();
        return b;
        
    }
}
class OrderProducer implements Callable<List<String>>{
    List<Order> o;
    OrderBuffer buf;
    OrderProducer(OrderBuffer b,List<Order> op){
        buf=b;
        o=op;
    }
    public List<String> call(){
        List<String>res =new ArrayList<>();
        for(int i=0;i<o.size();i++){
            try{
                buf.put(o.get(i));
                Order l=o.get(i);
                if(l!=null){
                    res.add("PRODUCED Order[ID="+l.order_id+", Customer="+l.customer_name+", Product="+l.product+", Qty="+l.qty+", Total="+l.qty*l.price+"]");
                }
            }
            catch(Exception e){
                System.out.println(e.getMessage());
            }
        }
        return res;        
    }
}
class OrderConsumer implements Callable<List<String>>{
    int nn;
    OrderBuffer o;
    OrderConsumer(OrderBuffer b,int p){
        nn=p;
        o=b;
    }
    public List<String> call(){
        List<String> res=new ArrayList<>();
        for(int i=0;i<nn;i++){
            try{
                Order o1=o.get();
                if(o1!=null){
                    res.add("CONSUMED Order[ID="+o1.order_id+", Total="+o1.qty*o1.price+"]");
                }
            }
            catch(Exception e){
                System.out.println(e.getMessage());
            }
        }
        return res;
    }
}

public class ProducerConsumerCallableDemo {
    

    /* ==========================
       IMPLEMENT YOUR CODE HERE
       ========================== */
    public static void main(String[] args) throws Exception {

        Scanner sc = new Scanner(System.in);

        int bufferCapacity = sc.nextInt();
        int n = sc.nextInt();

        List<Order> orders = new ArrayList<>();

        for (int i = 0; i < n; i++) {
            orders.add(new Order(
                    sc.nextInt(),
                    sc.next(),
                    sc.next(),
                    sc.nextInt(),
                    sc.nextDouble()
            ));
        }

        OrderBuffer buffer = new OrderBuffer(bufferCapacity);
        ExecutorService executor = Executors.newFixedThreadPool(2);

        long start = System.currentTimeMillis();

        Future<List<String>> producerFuture =
                executor.submit(new OrderProducer(buffer, orders));

        Future<List<String>> consumerFuture =
                executor.submit(new OrderConsumer(buffer, n));

        /* ---- PHASE 1: PRINT PRODUCERS ---- */
        for (String log : producerFuture.get()) {
            System.out.println(log);
        }

        /* ---- PHASE 2: PRINT CONSUMERS ---- */
        for (String log : consumerFuture.get()) {
            System.out.println(log);
        }

        executor.shutdown();
        sc.close();
    }
}