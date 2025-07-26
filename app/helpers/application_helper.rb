module ApplicationHelper
  def nav_link_class(path)
    if current_page?(path)
      "bg-amber-50 text-amber-600 rounded-md px-3 py-2 text-sm font-medium"
    else
      "text-gray-500 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
    end
  end
end