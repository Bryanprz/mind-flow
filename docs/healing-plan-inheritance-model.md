### **Title: Design Doc: Modeling Prakruti and Vikruti Healing Plans using Inheritance**

**Author:** Bryan Prz
**Date:** 2025-09-05
**Status:** Implemented

#### **1. Abstract**

This document outlines the design and implementation of a system to manage two distinct types of healing plans: `PrakrutiPlan` (a user's foundational, constitutional plan) and `VikrutiPlan` (a plan to address a user's current imbalances). We will use Single Table Inheritance (STI) to model these plans within a single `healing_plans` table, providing a clean, maintainable, and scalable solution.

#### **2. Background and Problem Statement**

The core of the Ancient Herb platform is the concept of a "healing plan." However, there are two fundamentally different types of plans a user can have:

1.  **Prakruti Plan:** This represents a user's core constitutional nature (`Prakruti`). A user has **only one** `PrakrutiPlan`, which is long-lived and rarely changes.
2.  **Vikruti Plan:** This represents a plan to address a temporary imbalance (`Vikruti`). A user can have **many** `VikrutiPlans` over time, each with its own lifecycle (e.g., a 30-day plan to address a specific issue).

The challenge is to model this relationship in a way that is both flexible and easy to work with, without duplicating code or creating unnecessary database complexity.

#### **3. Proposed Solution: Single Table Inheritance (STI)**

We will use Rails' built-in Single Table Inheritance (STI) to model both `PrakrutiPlan` and `VikrutiPlan` within the existing `healing_plans` table. This approach involves adding a `type` column to the `healing_plans` table, which will store the class name of the specific plan type (`'PrakrutiPlan'` or `'VikrutiPlan'`).

This approach was chosen over alternatives like creating separate `prakruti_plans` and `vikruti_plans` tables for the following reasons:

*   **Code Reusability:** Both plan types share a significant amount of common functionality (e.g., associations to foods, herbs, etc.). STI allows us to define this shared logic in a `HealingPlan` base class.
*   **Simplified Queries:** We can query for all healing plans, regardless of type, with a single query on the `healing_plans` table.
*   **Flexibility:** It is easy to add new plan types in the future without requiring significant schema changes.

#### **4. Implementation Details**

**4.1. Database Migration**

First, we will add a `type` column to the `healing_plans` table:

```ruby
# db/migrate/YYYYMMDDHHMMSS_add_type_to_healing_plans.rb
class AddTypeToHealingPlans < ActiveRecord::Migration[8.0]
  def change
    add_column :healing_plans, :type, :string
  end
end
```

**4.2. Model Implementation**

We will create `PrakrutiPlan` and `VikrutiPlan` models that inherit from `HealingPlan`.

```ruby
# app/models/healing_plan.rb
class HealingPlan < ApplicationRecord
  # Common associations and logic go here
  belongs_to :user
  has_many :healing_plan_foods
  # ...
end

# app/models/prakruti_plan.rb
class PrakrutiPlan < HealingPlan
  # Specific logic for Prakruti plans
  # e.g., validations to ensure a user has only one
  validates_uniqueness_of :user_id
end

# app/models/vikruti_plan.rb
class VikrutiPlan < HealingPlan
  # Specific logic for Vikruti plans
  # e.g., methods related to plan duration and completion
end
```

**4.3. User Model Associations**

The `User` model will be updated with specific associations for each plan type:

```ruby
# app/models/user.rb
class User < ApplicationRecord
  has_one :prakruti_plan
  has_many :vikruti_plans
end
```

**4.4. Refactoring the `HealingProtocolManager`**

This design significantly simplifies the `HealingProtocolManager`. Instead of complex conditional logic to determine which type of plan to create, it can now simply instantiate the correct class:

```ruby
# app/services/healing_protocol_manager.rb
class HealingProtocolManager
  def self.create_plan(user:, type:, attributes:)
    plan_class = type.classify.constantize # e.g., 'PrakrutiPlan' or 'VikrutiPlan'
    plan_class.create(user: user, **attributes)
  end
end
```

#### **5. Trade-offs**

The primary trade-off of STI is that it can lead to "sparse" columns in the database if the subclasses have very different data requirements. In our case, `PrakrutiPlan` and `VikrutiPlan` share the vast majority of their attributes, so this is not a significant concern. The benefits of code reuse and simplified queries far outweigh this minor trade-off.

#### **6. Conclusion**

Using STI to model `PrakrutiPlan` and `VikrutiPlan` provides a clean, object-oriented solution that aligns well with Rails conventions. It reduces code duplication, simplifies data management, and provides a solid foundation for future feature development.
