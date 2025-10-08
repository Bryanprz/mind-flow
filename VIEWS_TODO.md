# Views Cleanup TODO

## Status: Partial Cleanup Complete

Many view files still contain references to old Ayurveda-specific features. The app may have errors when navigating to certain pages.

## What Was Done
- ✅ Deleted entire `app/views/healing_plans` directory
- ✅ Deleted entire `app/views/healing_plan_logs` directory  
- ✅ Deleted entire `app/views/health_assessments` directory
- ✅ Deleted entire `app/views/chronic_illnesses` directory
- ✅ Deleted entire `app/views/admin` directory
- ✅ Fixed home page CTAs
- ✅ Updated sidebar navigation

## Still Need Updates

The following views still have references to `prakruti`, `vikruti`, `healing_plan` or Ayurveda features:

### Dashboard Views
- `app/views/dashboards/_calendar_card.html.erb` - References `@healing_plan`
- `app/views/dashboards/_streak_card.html.erb` - References `@healing_plan`
- `app/views/dashboards/_dashboard_content.html.erb` - References `prakruti`

### User Views
- `app/views/users/show.html.erb` - May reference healing plans
- `app/views/users/_user.json.jbuilder` - References prakruti/vikruti
- `app/views/users/_user.html.erb` - References prakruti

### Layout Views
- `app/views/layouts/_navigation_links.html.erb` - May reference old paths
- `app/views/layouts/_avatar_dropdown_links.html.erb` - May reference old paths

### Newsletter Views
- `app/views/newsletter_mailer/*` - References assessment paths

## Recommended Approach

### Option 1: Quick Fix (Recommended for Demo)
Create minimal views for the habit plan features:
- `app/views/habit_plans/show.html.erb`
- `app/views/habit_logs/index.html.erb`
- Update dashboard controller to use `@habit_plan` instead of `@healing_plan`

### Option 2: Full Cleanup
Go through each file and update all references. This would take significant time.

## Workaround for Now

The main features (habit tracking) work. Some pages may 404 or error if users try to access them. For a demo, you can:
1. Focus on showing the main habit tracking flow
2. Note in README that some pages are being refactored
3. Or create stub views that show "Coming Soon" messages

## Next Steps

```bash
# Create basic habit plan views
mkdir -p app/views/habit_plans
mkdir -p app/views/habit_logs

# Copy and adapt from old structure or create new minimal views
```



