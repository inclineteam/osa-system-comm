<x-mail::message>
# Welcome to OSA SYSTEM, {{$unit_head->firstname}}!

You've been added as an unit head.
<hr/>

#

<x-mail::button :align="'left'" :url="$url">
Log in to your account
</x-mail::button>

<br>
</x-mail::message>
