using Google.OrTools.Sat;
using Factory.Optimization.Models;

namespace Factory.Optimization.Services;

public class FiniteCapacityScheduler
{
    public List<ScheduledJob> ScheduleJobs(List<ManufacturingJob> jobs)
    {
        var model = new CpModel();
        var jobsByMachine = jobs.GroupBy(j => j.MachineId);
        var jobIntervals = new Dictionary<string, IntervalVar>();
        var jobEnds = new Dictionary<string, IntVar>();
        var jobStarts = new Dictionary<string, IntVar>();

        // Horizon hesapla (oldukça ileri bir tarih - örn: 365 gün)
        // Başlangıç tarihi olarak bugünü 0 kabul edelim.
        var referenceDate = DateTime.Today;
        var horizon = 365; 

        foreach (var job in jobs)
        {
            // Değişkenler: Start, Duration (sabit), End
            // Start için alt sınır: EarliestStartDate
            var earliestStartDay = (int)(job.EarliestStartDate - referenceDate).TotalDays;
            if (earliestStartDay < 0) earliestStartDay = 0;

            var startVar = model.NewIntVar(earliestStartDay, horizon, $"start_{job.JobId}");
            var endVar = model.NewIntVar(earliestStartDay, horizon, $"end_{job.JobId}");
            var intervalVar = model.NewIntervalVar(startVar, job.Duration, endVar, $"interval_{job.JobId}");
            
            jobIntervals[job.JobId] = intervalVar;
            jobEnds[job.JobId] = endVar;
            jobStarts[job.JobId] = startVar;
        }

        // Kısıtlar: Aynı makinedeki işler çakışamaz (No Overlap)
        foreach (var machineGroup in jobsByMachine)
        {
            var intervals = machineGroup.Select(j => jobIntervals[j.JobId]).ToList();
            if (intervals.Count > 1)
            {
                model.AddNoOverlap(intervals);
            }
        }

        // Hedef Fonksiyonu: Gecikmeyi minimize et (veya bitiş zamanlarını erkene çek)
        // Basitlik için: Makespan (en son biten işin bitiş zamanı) minimize edelim.
        // Daha iyisi: DueDate deviation minimize etmek.
        
        var latenessVars = new List<IntVar>();
        foreach (var job in jobs)
        {
            var dueDay = (int)(job.DueDate - referenceDate).TotalDays;
            // lateness = max(0, end - due)
            var lateness = model.NewIntVar(0, horizon, $"lateness_{job.JobId}");
            model.Add(lateness >= jobEnds[job.JobId] - dueDay);
            latenessVars.Add(lateness);
        }

        // Toplam gecikmeyi minimize et
        model.Minimize(LinearExpr.Sum(latenessVars));

        // Çöz
        var solver = new CpSolver();
        // solver.StringParameters = "max_time_in_seconds:10.0"; // Timeout
        var status = solver.Solve(model);

        var result = new List<ScheduledJob>();

        if (status == CpSolverStatus.Optimal || status == CpSolverStatus.Feasible)
        {
            foreach (var job in jobs)
            {
                var startDay = (int)solver.Value(jobStarts[job.JobId]);
                var endDay = (int)solver.Value(jobEnds[job.JobId]);

                result.Add(new ScheduledJob
                {
                    JobId = job.JobId,
                    StartDate = referenceDate.AddDays(startDay),
                    EndDate = referenceDate.AddDays(endDay),
                    IsLate = solver.Value(latenessVars[jobs.IndexOf(job)]) > 0
                });
            }
        }
        else
        {
            // Çözüm bulunamadı veya infeasible (bu modelde zor, çünkü horizon geniş)
            throw new Exception($"Scheduling failed with status: {status}");
        }

        return result;
    }
}
