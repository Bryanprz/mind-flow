# Cleanup & Build Plan: Complete Portfolio Transformation

## Phase 0: Remove Old Ayurveda Models (30-45 minutes)

### Models to Remove

#### 🗑️ Bio Profile System (4 models)
- `app/models/bio_profile.rb`
- `app/models/bio_profile_healing_food.rb`
- `app/models/bio_profile_aggravating_food.rb`
- `app/models/bio_profile_supplement.rb`

**Why Remove**: Ayurveda-specific, not relevant to MindFlow mental training focus

#### 🗑️ Assessment System (5 models)
- `app/models/assessment_entry.rb`
- `app/models/assessment_question.rb`
- `app/models/assessment_answer.rb`
- `app/models/assessment_option.rb`
- `app/models/health_assessment.rb`

**Why Remove**: Old Ayurveda health assessment system, not used in current app flow

#### 🗑️ Healing Plan Template (1 model)
- `app/models/healing_plan_template.rb`

**Why Remove**: Renamed to habit_plan_template, this is duplicate/old

#### 🗑️ Lifestyle Plan (1 model)
- `app/models/lifestyle_plan.rb`

**Why Remove**: Ayurveda-specific, not in current feature set

**Total**: 11 models to remove

### Controllers to Remove/Update

#### Remove Entirely
- `app/controllers/lifestyle_plans_controller.rb` - Not used

#### Update User Model
Remove from `app/models/user.rb`:
```ruby
# Line 14: Remove this association
has_many :assessment_entries, dependent: :destroy

# Lines 58-95: Remove all assessment-related methods
def assessment_count
def has_completed_assessments?
def wellness_score  # References assessment_entries
def wellness_mastery_level  # Based on wellness_score
```

### Migrations to Review
These migrations created the tables we're removing:
- `20251009192924_create_bio_profiles.rb`
- `20250818023659_rename_quiz_and_related_tables.rb` (and related)
- `20250829053236_create_lifestyle_plan.rb`

**Note**: Don't delete migrations! They're historical record. Tables will be dropped in new migration.

### Cleanup Steps

1. **Delete Model Files** (11 files)
2. **Delete Controller** (1 file)
3. **Update User Model** (remove associations)
4. **Create Migration** to drop tables:
   ```ruby
   rails g migration RemoveAyurvedaModels
   ```
5. **Update Routes** (remove lifestyle_plans routes)
6. **Check Views** (remove any assessment/lifestyle views)

---

## Phase 1: Build Real Analytics System (2-3 hours)

### What We're Building
Replace demo YAML data with real aggregations from `habit_logs` and `plan_item_logs`

### Tasks

#### 1. Create AnalyticsService (45 min)
```ruby
# app/services/analytics_service.rb
class AnalyticsService
  def initialize(user)
    @user = user
  end

  def focus_sessions
    # Aggregate from habit_logs
  end

  def performance_metrics
    # Calculate from plan_item_logs
  end

  def weekly_summary
    # Last 7 days stats
  end
end
```

#### 2. Calculate Real Metrics (60 min)
- **Focus Sessions**: From `HabitLog` with date, completion_percentage
- **Performance Metrics**: 
  - avg_focus: Average completion rate
  - peak_flow: Best streak day
  - sessions_completed: Count of logs
  - total_duration: Sum of time spent
- **Weekly Summary**:
  - total_sessions: Last 7 days count
  - avg_flow_state: Average completion
  - improvement: Week-over-week change

#### 3. Update Controller (15 min)
```ruby
def analytics
  @analytics_data = AnalyticsService.new(Current.user).call
end
```

#### 4. Test (30 min)
- Create test habit logs
- Verify calculations
- Check edge cases (no data, single day, etc.)

**Estimated Time**: 2-3 hours  
**Test Before Continuing**: ✅ Verify analytics page loads with real data

---

## Phase 2: Build Goals Management System (3-4 hours)

### What We're Building
Full CRUD system for user goals with progress tracking

### Tasks

#### 1. Generate Model (15 min)
```bash
rails g model Goal user:references title:string description:text target:integer progress:integer deadline:date category:string status:string icon:string
```

#### 2. Update Model (30 min)
```ruby
# app/models/goal.rb
class Goal < ApplicationRecord
  belongs_to :user
  
  enum status: { active: 0, completed: 1, cancelled: 2 }
  
  validates :title, presence: true
  validates :target, presence: true, numericality: { greater_than: 0 }
  validates :progress, numericality: { greater_than_or_equal_to: 0 }
  
  def progress_percentage
    return 0 if target.zero?
    (progress.to_f / target * 100).round
  end
  
  def completed?
    progress >= target
  end
end
```

#### 3. Create Controller (45 min)
```ruby
# app/controllers/goals_controller.rb
class GoalsController < ApplicationController
  before_action :set_goal, only: [:show, :edit, :update, :destroy]
  
  def index
    @goals = Current.user.goals.active.order(deadline: :asc)
    @completed_goals = Current.user.goals.completed.order(completed_at: :desc).limit(5)
  end
  
  def new
    @goal = Current.user.goals.build
  end
  
  def create
    @goal = Current.user.goals.build(goal_params)
    if @goal.save
      redirect_to goals_path, notice: "Goal created!"
    else
      render :new, status: :unprocessable_entity
    end
  end
  
  # ... update, destroy
end
```

#### 4. Create Views (90 min)
- `views/goals/index.html.erb` - List with progress bars
- `views/goals/new.html.erb` - Creation form
- `views/goals/edit.html.erb` - Edit form
- `views/goals/_form.html.erb` - Shared form partial
- `views/goals/_goal.html.erb` - Goal card partial

#### 5. Update Routes (5 min)
```ruby
resources :goals
```

#### 6. Update Pages Controller (15 min)
Replace demo data loader with real Goal queries

#### 7. Seed Goals (15 min)
Add sample goals to seeds.rb

**Estimated Time**: 3-4 hours  
**Test Before Continuing**: ✅ Can create, edit, delete goals. Progress displays correctly.

---

## Phase 3: Build Achievement System (3-4 hours)

### What We're Building
Trigger-based achievements that unlock based on user actions

### Tasks

#### 1. Generate Models (20 min)
```bash
rails g model Achievement title:string description:text icon:string trigger_type:string trigger_value:integer points:integer
rails g model UserAchievement user:references achievement:references earned_at:datetime
```

#### 2. Define Achievements (45 min)
```ruby
# app/models/achievement.rb
class Achievement < ApplicationRecord
  has_many :user_achievements
  has_many :users, through: :user_achievements
  
  TRIGGERS = {
    first_habit: 'Complete your first habit',
    streak_7: 'Maintain 7-day streak',
    streak_30: '30 days strong!',
    total_50: '50 total completions',
    perfect_day: '100% completion day',
    goal_completed: 'Complete a goal',
    goals_10: 'Complete 10 goals'
  }.freeze
end
```

#### 3. Create AchievementService (90 min)
```ruby
# app/services/achievement_service.rb
class AchievementService
  def initialize(user)
    @user = user
  end
  
  def check_and_unlock(event_type, context = {})
    # Check if achievement should be unlocked
    # Award if criteria met
    # Return newly unlocked achievements
  end
  
  private
  
  def check_first_habit
  def check_streak_achievements
  def check_total_completions
  def check_perfect_day
  def check_goal_achievements
end
```

#### 4. Hook into Workflows (45 min)
Update:
- `HabitPlansController#log_item_progress` - Check achievements after logging
- `GoalsController#update` - Check goal achievements

#### 5. Create Views (45 min)
- `views/achievements/index.html.erb` - Achievement gallery
- `views/achievements/_achievement.html.erb` - Achievement card
- Add achievements section to dashboard

#### 6. Seed Achievements (20 min)
Create all achievement definitions

**Estimated Time**: 3-4 hours  
**Test Before Continuing**: ✅ Achievements unlock when actions are completed

---

## Phase 4: Build Learning Hub (4-5 hours)

### What We're Building
Course system with lessons and progress tracking

### Tasks

#### 1. Generate Models (30 min)
```bash
rails g model Course title:string description:text instructor:string difficulty:string rating:decimal duration:integer thumbnail:string
rails g model Lesson course:references title:string content:text duration:integer position:integer video_url:string
rails g model CourseEnrollment user:references course:references started_at:datetime completed_at:datetime progress_percent:integer
rails g model LessonCompletion user:references lesson:references completed_at:datetime
```

#### 2. Setup Associations (30 min)
```ruby
# app/models/course.rb
class Course < ApplicationRecord
  has_many :lessons, -> { order(position: :asc) }
  has_many :course_enrollments
  has_many :enrolled_users, through: :course_enrollments, source: :user
  
  validates :title, :instructor, presence: true
  
  def lessons_count
    lessons.count
  end
end

# app/models/lesson.rb
class Lesson < ApplicationRecord
  belongs_to :course
  has_many :lesson_completions
  
  validates :title, :position, presence: true
end

# app/models/course_enrollment.rb
class CourseEnrollment < ApplicationRecord
  belongs_to :user
  belongs_to :course
  
  def calculate_progress
    total = course.lessons_count
    return 0 if total.zero?
    
    completed = user.lesson_completions.joins(:lesson).where(lessons: { course_id: course.id }).count
    (completed.to_f / total * 100).round
  end
end
```

#### 3. Create Controllers (90 min)
```ruby
# app/controllers/courses_controller.rb
class CoursesController < ApplicationController
  def index
    @courses = Course.all
    @my_courses = Current.user.course_enrollments.includes(:course)
  end
  
  def show
    @course = Course.find(params[:id])
    @enrollment = Current.user.course_enrollments.find_or_initialize_by(course: @course)
    @lessons = @course.lessons
    @completed_lessons = Current.user.lesson_completions.where(lesson: @lessons)
  end
  
  def enroll
    # Start course
  end
end

# app/controllers/lessons_controller.rb
class LessonsController < ApplicationController
  def show
    @lesson = Lesson.find(params[:id])
    @course = @lesson.course
  end
  
  def complete
    @lesson = Lesson.find(params[:id])
    Current.user.lesson_completions.find_or_create_by(lesson: @lesson, completed_at: Time.current)
    # Update course progress
    redirect_to course_path(@lesson.course), notice: "Lesson completed!"
  end
end
```

#### 4. Create Views (120 min)
- `views/courses/index.html.erb` - Course catalog
- `views/courses/show.html.erb` - Course detail with lessons
- `views/lessons/show.html.erb` - Lesson content
- `views/courses/_course_card.html.erb` - Course card partial
- `views/lessons/_lesson_item.html.erb` - Lesson list item

#### 5. Update Routes (10 min)
```ruby
resources :courses, only: [:index, :show] do
  member do
    post :enroll
  end
  resources :lessons, only: [:show] do
    member do
      post :complete
    end
  end
end
```

#### 6. Seed Courses & Lessons (45 min)
Create 5-6 courses with 5-8 lessons each

#### 7. Update Pages Controller (15 min)
Replace demo data with real Course queries

**Estimated Time**: 4-5 hours  
**Test Before Continuing**: ✅ Can browse courses, enroll, complete lessons, see progress

---

## Phase 5: Update README (30 min)

### Update Core Functionality Section
```markdown
### Core Functionality
- ✅ **Habit Tracking System** - Full CRUD for daily habits with comprehensive logging
- ✅ **Real-time Analytics** - Performance metrics aggregated from your actual habit data
- ✅ **Goal Management** - Set, track, and achieve cognitive performance goals
- ✅ **Achievement System** - Unlock achievements based on your progress and milestones
- ✅ **Learning Hub** - Browse courses, enroll, and track your learning progress
- ✅ **User Authentication** - Rails 8 authentication with session management
- ✅ **React Dashboard** - Interactive dashboard with real-time updates
- ✅ **Responsive Design** - Mobile-first UI with Tailwind CSS
```

### Add Note About Transformation
```markdown
## Recent Enhancements (October 2025)

This application was recently enhanced with:
- Real analytics aggregation from user activity data
- Complete goal management system with progress tracking
- Gamification through achievement system
- Learning hub with course enrollment and lesson completion
- Comprehensive data visualization with Visx charts

All demo features have been replaced with fully functional systems.
```

---

## Execution Timeline

### Day 1 (4-5 hours)
- ✅ Phase 0: Cleanup (45 min)
- ✅ Phase 1: Analytics (2-3 hours)
- ✅ Phase 2: Goals (partial - 1 hour)

### Day 2 (6-7 hours)
- ✅ Phase 2: Goals (complete - 2-3 hours)
- ✅ Phase 3: Achievements (3-4 hours)

### Day 3 (4-5 hours)
- ✅ Phase 4: Learning Hub (4-5 hours)

### Day 4 (30 min)
- ✅ Phase 5: Update README
- ✅ Final testing
- ✅ Deploy/commit

**Total Time**: 15-18 hours spread over 3-4 days

---

## Testing Strategy

After Each Phase:
1. ✅ Manual testing in browser
2. ✅ Check all CRUD operations work
3. ✅ Verify data displays correctly
4. ✅ Test edge cases (no data, errors)
5. ✅ Commit working code

Final Testing:
1. ✅ Test full user flow (signup → habits → goals → achievements → courses)
2. ✅ Check responsive design on mobile
3. ✅ Verify no console errors
4. ✅ Test with multiple users
5. ✅ Performance check (page load times)

---

## Commit Strategy

After each phase:
```bash
git add .
git commit -m "feat: [phase name] - [brief description]"
```

Example commits:
```
feat: remove ayurveda models and cleanup old code
feat: analytics system with real data aggregation
feat: goals management with CRUD and progress tracking
feat: achievement system with trigger-based unlocking
feat: learning hub with courses and lesson tracking
docs: update README with all working features
```

---

## Ready to Start?

Say "start" and I'll begin with Phase 0: Cleanup!

I'll work through each phase systematically, testing before moving to the next.

