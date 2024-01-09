$i = 1
Get-ChildItem *.png | Sort-Object Name | ForEach-Object {
    Rename-Item $_ -NewName ('{0}.png' -f $i)
    $i++
}
